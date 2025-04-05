import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from './ui/table';
import { Button } from './ui/button';
import { useBlock } from '@/providers/block';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { FetchStatus } from '@/utils/types';
import { TransactionError } from '@solana/web3.js';

interface TransactionWithMeta {
	transaction: {
		signatures: string[];
	};
	meta: {
		fee: number;
		err: TransactionError | null;
		computeUnitsConsumed?: number;
	};
}

export default function TransactionsCard({ slot }: { slot: string }) {
	const slotNum = BigInt(slot);
	const { blockInfo, getBlock, status } = useBlock();
	const { block } = blockInfo || {};

	const [displayCount, setDisplayCount] = useState(40);

	useEffect(() => {
		getBlock(slotNum);
	}, [slotNum]);

	if (status === FetchStatus.Fetching) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-center">
						<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (status === FetchStatus.FetchFailed || !blockInfo) {
		return (
			<Card>
				<CardContent className="p-6">
					<Alert variant="destructive">
						<AlertDescription>
							Failed to load transactions
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	const displayedTransactions = block?.transactions?.slice(0, displayCount) || [];
	const hasMoreTransactions = block?.transactions
		? block.transactions.length > displayCount
		: false;

	const handleLoadMore = () => {
		setDisplayCount(prevCount => prevCount + 40);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<h2 className="text-lg font-semibold">Transactions</h2>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-16">#</TableHead>
							<TableHead className="w-24">Result</TableHead>
							<TableHead className="">Signature</TableHead>
							<TableHead className="w-24">Fee</TableHead>
							<TableHead className="w-24">Compute</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{displayedTransactions.map((transaction: TransactionWithMeta, index: number) => (
							<TableRow key={index}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>
									<span className={transaction.meta?.err === null ? "text-green-500" : "text-red-500"}>
										{transaction.meta?.err === null ? "Success" : "Failed"}
									</span>
								</TableCell>
								<TableCell>
									<Link href={`/tx/${transaction.transaction.signatures[0]}`}
										className='font-semibold opacity-100 hover:opacity-80 transition-all duration-200'>
										{transaction.transaction.signatures[0].slice(0, 30)}...
									</Link>
								</TableCell>
								<TableCell>{transaction.meta?.fee}</TableCell>
								<TableCell>{transaction.meta?.computeUnitsConsumed || "N/A"}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{hasMoreTransactions && (
					<div className="mt-4 flex justify-center">
						<Button
							onClick={handleLoadMore}
							variant="outline"
						>
							Load More
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	)
}