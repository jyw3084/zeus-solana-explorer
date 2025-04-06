"use client"

import React from "react";
import BlockInfoCard from "@/components/BlockInfoCard";
import TransactionsCard from "@/components/TransactionsCard";

export const runtime = 'edge';

export default function BlockPage() {
	return (
		<main className="container mx-auto p-8">
			<div className="space-y-8">
				<BlockInfoCard />
				<TransactionsCard />
			</div>
		</main>
	)
}