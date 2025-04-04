"use client"

import React from "react";
import BlockInfoCard from "@/components/BlockInfoCard";
import TransactionsCard from "@/components/TransactionsCard";

export default function BlockPage({
	params,
}: {
	params: { slot: string },
}
) {
	const resolvedParams = React.use(params);
	const { slot } = resolvedParams;

	return (
		<main className="container mx-auto p-8">
			<div className="space-y-8">
				<BlockInfoCard slot={slot} />
				<TransactionsCard slot={slot} />
			</div>
		</main>
	)
}