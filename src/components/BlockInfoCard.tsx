import { useBlock } from '@/providers/block';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableRow, TableCell } from './ui/table';
import { useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { FetchStatus } from '@/utils/types';
import { useParams } from 'next/navigation';

export default function BlockInfoCard() {
	const { slot } = useParams();
	const slotNum = BigInt(Array.isArray(slot) ? slot[0] : slot);
	const { blockInfo, getBlock, status } = useBlock();
	const { block, blockLeader, parentLeader, childLeader, childSlot } = blockInfo || {};

	useEffect(() => {
		getBlock(slotNum);
	}, [slotNum]);

	if (status === FetchStatus.Fetching) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-center">
						<div
							role="status"
							aria-label="Loading"
							className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
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
							Failed to load block information
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<h1 className="text-2xl font-bold">Block {slot.toString()}</h1>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell className="font-medium">Block Hash</TableCell>
							<TableCell className="text-right">{block?.blockhash?.toString() || 'N/A'}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Slot</TableCell>
							<TableCell className="text-right">{slot.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Slot Leader</TableCell>
							<TableCell className="text-right">{blockLeader?.toString() || 'N/A'}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Timestamp (Local)</TableCell>
							<TableCell className="text-right">{block?.blockTime ? new Date(Number(block?.blockTime) * 1000).toLocaleString() : 'N/A'}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Timestamp (UTC)</TableCell>
							<TableCell className="text-right">{block?.blockTime ? new Date(Number(block?.blockTime) * 1000).toLocaleString('en-US', { timeZone: 'UTC' }) : 'N/A'}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Block Height</TableCell>
							<TableCell className="text-right">{block?.blockHeight}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Parent Slot</TableCell>
							<TableCell className="text-right">{block?.parentSlot}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Parent Slot Leader</TableCell>
							<TableCell className="text-right">{parentLeader?.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Child Slot</TableCell>
							<TableCell className="text-right">{childSlot?.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Child Slot Leader</TableCell>
							<TableCell className="text-right">{childLeader?.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Number of Transactions</TableCell>
							<TableCell className="text-right">{block?.transactions?.length || 0}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}