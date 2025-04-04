import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableRow, TableCell, TableHeader } from './ui/table';
import { Button } from './ui/button';
import { useCluster } from '@/providers/cluster';
import { getBlocksWithLimit, getSingleBlockTime } from '@/server/data';
import Link from 'next/link';
import { BLOCKS_PER_PAGE } from '@/data/constants';
import { UnixTimestamp } from '@solana/web3.js';
import { BlockDataWithTimestamp } from '@/utils/types';
import { ArrowUpDown } from 'lucide-react';

export default function BlocksCard() {
	const { epochInfo } = useCluster();
	const [blocks, setBlocks] = useState<BlockDataWithTimestamp[]>([]);
	const [loadingMore, setLoadingMore] = useState(false);
	const [sortField, setSortField] = useState<'slot' | 'timestamp'>('slot');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

	const fetchBlocksWithTime = async (offset: number = 0) => {
		if (!epochInfo?.absoluteSlot) return;
		const blockNumbers = await getBlocksWithLimit(epochInfo.absoluteSlot - BigInt(BLOCKS_PER_PAGE), BLOCKS_PER_PAGE + offset);

		if (blockNumbers) {
			const blocksWithTime = await Promise.all(
				blockNumbers.map(async (slot) => {
					const timestamp = await getSingleBlockTime(slot);
					return { slot, timestamp };
				})
			);

			if (offset === 0) {
				setBlocks(blocksWithTime);
			} else {
				setBlocks(prev => [...prev, ...blocksWithTime]);
			}
		}
	};

	useEffect(() => {
		fetchBlocksWithTime();
		return () => setBlocks([]);
	}, [epochInfo]);

	const handleLoadMore = async () => {
		setLoadingMore(true);
		await fetchBlocksWithTime(blocks.length);
		setLoadingMore(false);
	};

	const formatTimestamp = (timestamp: UnixTimestamp | null) => {
		if (!timestamp) return 'NULL';
		return new Date(Number(timestamp) * 1000).toLocaleString();
	};

	const handleSort = (field: 'slot' | 'timestamp') => {
		if (sortField === field) {
			setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('desc');
		}
	};

	const sortedBlocks = [...(blocks || [])].sort((a, b) => {
		const direction = sortDirection === 'asc' ? 1 : -1;
		if (sortField === 'slot') {
			return direction * Number(b.slot - a.slot);
		} else {
			// Convert timestamps to numbers before comparison
			const timestampA = Number(a.timestamp || 0);
			const timestampB = Number(b.timestamp || 0);
			return direction * (timestampB - timestampA);
		}
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<h2 className="text-lg font-semibold">Blocks</h2>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell className="text-left">
								<button
									onClick={() => handleSort('slot')}
									className="flex items-center gap-2 hover:opacity-80"
								>
									<span className="text-sm font-semibold">Slot</span>
									<ArrowUpDown className="h-4 w-4" />
								</button>
							</TableCell>
							<TableCell className="text-left">
								<button
									onClick={() => handleSort('timestamp')}
									className="flex items-center gap-2 hover:opacity-80"
								>
									<span className="text-sm font-semibold">Timestamp</span>
									<ArrowUpDown className="h-4 w-4" />
								</button>
							</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedBlocks.map((block, index) => (
							<TableRow key={index}>
								<TableCell className="flex justify-between items-center">
									<Link href={`/block/${block.slot}`}
										className="font-semibold opacity-80 hover:opacity-100 transition-opacity duration-200">
										{block.slot.toString()}
									</Link>
								</TableCell>
								<TableCell>
									<div className="text-sm text-muted-foreground">
										{formatTimestamp(block.timestamp)}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className="mt-4 flex justify-center">
					<Button
						variant="outline"
						onClick={handleLoadMore}
						disabled={loadingMore}
					>
						{loadingMore ? 'Loading...' : 'Load More'}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}