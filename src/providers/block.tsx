"use client";

import { getBlock, getBlocks, getSlotLeaders } from "@/server/data";
import { Block, BlockContextType, FetchStatus } from "@/utils/types";
import { createContext, useContext, ReactNode, useState } from "react";

const BlockContext = createContext<BlockContextType | undefined>(undefined);

export function BlockProvider({ children }: { children: ReactNode }) {
	const [blockInfo, setBlockInfo] = useState<Block | undefined>();
	const [status, setStatus] = useState<FetchStatus>(FetchStatus.Fetching);

	const fetchBlock = async (slot: bigint) => {
		setStatus(FetchStatus.Fetching);

		try {
			const block = await getBlock(slot);

			if (block === null) {
				setBlockInfo({});
				setStatus(FetchStatus.Fetched);
				return;
			}

			const childSlot = (await getBlocks(slot + BigInt(1), slot + BigInt(100)))?.shift();
			const firstLeaderSlot = block.parentSlot;

			let leaders: string[] | undefined = [];
			const lastLeaderSlot = childSlot !== undefined ? childSlot : slot;
			const slotLeadersLimit = Number(lastLeaderSlot - block.parentSlot + BigInt(1));
			leaders = await getSlotLeaders(firstLeaderSlot, slotLeadersLimit);

			const getLeader = (slot: number) => {
				return leaders?.at(Number(BigInt(slot) - firstLeaderSlot));
			};

			const data = {
				block,
				blockLeader: getLeader(Number(slot)),
				childLeader: childSlot !== undefined ? getLeader(Number(childSlot)) : undefined,
				childSlot,
				parentLeader: getLeader(block.parentSlot),
			};

			setBlockInfo(data);
			setStatus(FetchStatus.Fetched);

		} catch (err) {
			setStatus(FetchStatus.FetchFailed);
			console.error(err);
		}
	}

	console.log(blockInfo);

	return (
		<BlockContext.Provider value={{
			blockInfo,
			getBlock: fetchBlock,
			status
		}}>
			{children}
		</BlockContext.Provider>
	);
}

export function useBlock() {
	const context = useContext(BlockContext);
	if (context === undefined) {
		throw new Error("useBlock must be used within a BlockProvider");
	}
	return context;
}
