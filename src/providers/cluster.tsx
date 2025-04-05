"use client";

import { getEpochInfo, getRecentPerformanceSamples } from "@/server/data";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface ClusterContextType {
	epochInfo: EpochInfo | undefined;
	samples: ReadonlyArray<{
		readonly numSlots: bigint;
		readonly samplePeriodSecs: number;
		readonly numTransactions: bigint;
		readonly numNonVoteTransactions: bigint;
		readonly slot: bigint;
	}> | undefined;
	loading: boolean;
	error: Error | null;
}

type EpochInfo = {
	absoluteSlot: bigint;
	blockHeight: bigint;
	epoch: bigint;
	slotIndex: bigint;
	slotsInEpoch: bigint;
};

const ClusterContext = createContext<ClusterContextType | undefined>(undefined);

export function ClusterProvider({ children }: { children: ReactNode }) {
	const [clusterInfo, setClusterInfo] = useState<ClusterContextType>({
		epochInfo: undefined,
		samples: undefined,
		loading: false,
		error: null
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setClusterInfo(prev => ({ ...prev, loading: true, error: null }));
				const [epochInfo, samples] = await Promise.all([
					getEpochInfo(),
					getRecentPerformanceSamples(),
				]);
				setClusterInfo(prev => ({
					...prev,
					epochInfo,
					samples,
					loading: false
				}));
			} catch (err) {
				setClusterInfo(prev => ({
					...prev,
					error: err as Error,
					loading: false
				}));
			}
		};
		fetchData();
	}, []);

	return (
		<ClusterContext.Provider value={{ epochInfo: clusterInfo?.epochInfo, samples: clusterInfo?.samples, loading: clusterInfo?.loading, error: clusterInfo?.error }}>
			{children}
		</ClusterContext.Provider>
	);
}

export function useCluster() {
	const context = useContext(ClusterContext);
	if (context === undefined) {
		throw new Error("useCluster must be used within a ClusterProvider");
	}
	return context;
}