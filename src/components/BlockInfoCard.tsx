import { useBlock } from '@/providers/block';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableRow, TableCell } from './ui/table';
import { useEffect } from 'react';

export default function BlockInfoCard({ slot }: { slot: string }) {
	const slotNum = BigInt(slot);
	const { blockInfo, getBlock, status } = useBlock();

	useEffect(() => {
		getBlock(slotNum);
	}, [slotNum]);

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
							<TableCell className="text-right">{blockInfo?.block?.blockhash?.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Slot</TableCell>
							<TableCell className="text-right">{slot.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Slot Leader</TableCell>
							<TableCell className="text-right">{blockInfo?.blockLeader.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Timestamp (Local)</TableCell>
							<TableCell className="text-right">{blockInfo?.block.blockTime ? new Date(Number(blockInfo?.block.blockTime) * 1000).toLocaleString() : 'N/A'}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Timestamp (UTC)</TableCell>
							<TableCell className="text-right">{blockInfo?.block.blockTime ? new Date(Number(blockInfo?.block.blockTime) * 1000).toLocaleString('en-US', { timeZone: 'UTC' }) : 'N/A'}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Block Height</TableCell>
							<TableCell className="text-right">{blockInfo?.block.blockHeight}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Parent Slot</TableCell>
							<TableCell className="text-right">{blockInfo?.block.parentSlot}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Parent Slot Leader</TableCell>
							<TableCell className="text-right">{blockInfo?.parentLeader?.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Child Slot</TableCell>
							<TableCell className="text-right">{blockInfo?.childSlot?.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Child Slot Leader</TableCell>
							<TableCell className="text-right">{blockInfo?.childLeader?.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Number of Transactions</TableCell>
							<TableCell className="text-right">{blockInfo?.block.transactions?.length || 0}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}