import { UnixTimestamp } from "@solana/web3.js";

export type EpochSchedule = {
	slotsPerEpoch: bigint;
	leaderScheduleSlotOffset: bigint;
	warmup: boolean;
	firstNormalEpoch: bigint;
	firstNormalSlot: bigint;
};

export type SearchResult = {
	type: "Transaction" | "Block" | "Invalid";
	value: string;
} | null;

export enum FetchStatus {
	Fetching = 'fetching',
	Fetched = 'fetched',
	FetchFailed = 'failed'
}

export interface BlockContextType {
	blockInfo: Block | undefined;
	getBlock: (slot: bigint) => Promise<void>;
	status: FetchStatus;
}

export interface BlockData {
	blockhash: string;
	parentSlot: bigint;
	previousBlockhash: string;
	blockTime: UnixTimestamp | null;
	blockHeight: bigint | null;
}

export interface Block {
	block?: BlockData;
	blockLeader?: string;
	childLeader?: string;
	childSlot?: bigint;
	parentLeader?: string;
}