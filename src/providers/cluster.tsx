"use client";

import { getEpochInfo, getRecentPerformanceSamples } from "@/server/data";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { ClusterContextType } from "@/utils/types";

const ClusterContext = createContext<ClusterContextType | undefined>(undefined);

export function ClusterProvider({ children }: { children: ReactNode }) {
	const [clusterInfo, setClusterInfo] = useState<ClusterContextType>();

	useEffect(() => {
		const fetchData = async () => {
			const [epochInfo, samples] = await Promise.all([
				getEpochInfo(),
				getRecentPerformanceSamples(),
			]);
			const info = {
				epochInfo,
				samples,
			}
			setClusterInfo(info);
		};
		fetchData();
	}, []);

	return (
		<ClusterContext.Provider value={{ epochInfo: clusterInfo?.epochInfo, samples: clusterInfo?.samples }}>
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