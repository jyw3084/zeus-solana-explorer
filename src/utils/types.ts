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