import { UnixTimestamp } from "@solana/web3.js";

export interface ClusterContextType {
	epochInfo: EpochInfo | undefined;
	samples: ReadonlyArray<{
		readonly numSlots: bigint;
		readonly samplePeriodSecs: number;
		readonly numTransactions: bigint;
		readonly numNonVoteTransactions: bigint;
		readonly slot: bigint;
	}> | undefined;
}

export type EpochInfo = {
	absoluteSlot: bigint;
	blockHeight: bigint;
	epoch: bigint;
	slotIndex: bigint;
	slotsInEpoch: bigint;
};

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

export interface BlockDataWithTimestamp {
	slot: bigint;
	timestamp: UnixTimestamp | null;
}

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
	parentSlot: number;
	previousBlockhash: string;
	blockTime: number | null;
	blockHeight: number | null;
	transactions: Array<{
		transaction: {
			message: {
				accountKeys: string[];
				instructions: any[];
				recentBlockhash: string;
			};
			signatures: string[];
		};
		meta: {
			err: any | null;
			fee: number;
			postBalances: number[];
			preBalances: number[];
			status: {
				Ok: null | any;
			};
		};
	}>;
}

export interface Block {
	block?: BlockData;
	blockLeader?: string;
	childLeader?: string;
	childSlot?: bigint;
	parentLeader?: string;
}