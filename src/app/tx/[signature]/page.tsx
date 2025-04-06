"use client"

import AccountsCard from "@/components/transaction/AccountsCard";
import InstructionsCard from "@/components/transaction/InstructionsCard";
import LogsCard from "@/components/transaction/LogsCard";
import TransactionInfoCard from "@/components/transaction/TransactionInfoCard";

export const runtime = 'edge';

export default function TransactionPage() {
	return (
		<main className="container mx-auto p-8">
			<div className="space-y-8">
				<TransactionInfoCard />
				<AccountsCard />
				<InstructionsCard />
				<LogsCard />
			</div>
		</main>
	)
}