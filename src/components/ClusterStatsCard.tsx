import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableBody, TableRow, TableCell } from './ui/table';
import { useCluster } from '@/providers/cluster';

export default function ClusterStatsCard() {
	const { epochInfo, samples } = useCluster();
	const blockTime = Number(epochInfo?.blockHeight) * 1000;
	const epochProgress = (Number(epochInfo?.slotIndex) / Number(epochInfo?.slotsInEpoch)) * 100;

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
							<TableCell className="text-right">{blockTime.toString()}</TableCell>
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
							<TableCell className="text-right">{epochProgress.toFixed(2)}% complete</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Epoch Time Remaining (approx.)</TableCell>
							<TableCell className="text-right">{Math.floor(timeRemainingHours)} hours {Math.floor(timeRemainingMinutes)} minutes</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}