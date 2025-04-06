import { Alert, AlertDescription } from './ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableRow, TableCell } from './ui/table';
import { useCluster } from '@/providers/cluster';
import { useState, useEffect } from 'react';

export default function ClusterStatsCard() {
	const { epochInfo, samples, error, loading } = useCluster();
	const [blockTime, setBlockTime] = useState<number | null>(null);
	const [epochProgress, setEpochProgress] = useState<number | null>(null);

	useEffect(() => {
		if (epochInfo) {
			setBlockTime(Number(epochInfo.blockHeight) * 1000);
			setEpochProgress((Number(epochInfo.slotIndex) / Number(epochInfo.slotsInEpoch)) * 100);
		}
	}, [epochInfo]);

	// Calculate epoch time remaining
	const slotsRemaining = Number(epochInfo?.slotsInEpoch) - Number(epochInfo?.slotIndex);
	const timeRemainingMs = slotsRemaining * 400;
	const timeRemainingHours = timeRemainingMs / (1000 * 60 * 60);
	const timeRemainingMinutes = (timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60);

	const parsedSamples = samples?.filter(s => s.numSlots !== BigInt(0)).map(s => s.samplePeriodSecs / Number(s.numSlots)).slice(0, 60) ?? [];
	const samplesInHour = parsedSamples.length < 60 ? parsedSamples.length : 60;
	const avgSlotTime_1h = Number((parsedSamples.reduce((sum: number, cur: number) => {
		return sum + cur;
	}, 0) / samplesInHour)?.toFixed(3)) * 1000;
	const avgSlotTime_1min = Number(parsedSamples[0]?.toFixed(3)) * 1000;

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						<h1 className="text-2xl font-bold">Live Cluster Stats</h1>
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex items-center justify-center">
						<div
							role="status"
							aria-label="Loading"
							className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
						/>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						<h1 className="text-2xl font-bold">Live Cluster Stats</h1>
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<Alert variant="destructive">
						<AlertDescription>
							Failed to load cluster stats: {error.message}
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
					<h1 className="text-2xl font-bold">Live Cluster Stats</h1>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell className="font-medium">Slot</TableCell>
							<TableCell className="text-right">{epochInfo?.absoluteSlot.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Block Height</TableCell>
							<TableCell className="text-right">{epochInfo?.blockHeight.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Cluster Time</TableCell>
							<TableCell className="text-right">{blockTime?.toString()}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Slot Time (1min average)</TableCell>
							<TableCell className="text-right">{avgSlotTime_1min?.toString()}ms</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Slot Time (1hr average)</TableCell>
							<TableCell className="text-right">{avgSlotTime_1h?.toString()}ms</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Epoch</TableCell>
							<TableCell className="text-right">
								{epochInfo?.epoch.toString()}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Epoch Progress</TableCell>
							<TableCell className="text-right">{epochProgress?.toFixed(2)}% complete</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Epoch Time Remaining (approx.)</TableCell>
							<TableCell className="text-right">{Math.floor(timeRemainingHours)} hours {Math.floor(timeRemainingMinutes)} minutes</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}