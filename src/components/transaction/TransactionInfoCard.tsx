import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Table, TableBody, TableRow, TableCell } from '../ui/table';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { useTransaction } from '@/providers/transaction';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function TransactionInfo() {
	const { signature } = useParams();
	const { transaction, getTransaction, loading, error } = useTransaction();
	const { data, status } = transaction;

	useEffect(() => {
		getTransaction(signature);
	}, []);

	if (loading) {
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

	if (error) {
		return (
			<Card>
				<CardContent className="p-6">
					<Alert variant="destructive">
						<AlertDescription>
							Failed to load transaction information: {error.message}
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
					<h1 className="text-2xl font-bold">Transaction</h1>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell className="font-medium">Signature</TableCell>
							<TableCell className="text-right">{data?.transaction.signatures[0]}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Result</TableCell>
							<TableCell className="text-right">{data?.meta?.err === null ? 'Success' : 'Error'}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Timestamp</TableCell>
							<TableCell className="text-right">{data?.blockTime ? `${new Date(Number(data?.blockTime) * 1000).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : 'N/A'}</TableCell>
						</TableRow>
						{status?.value[0] !== null && (
							<>
								<TableRow>
									<TableCell className="font-medium">Confirmation Status</TableCell>
									<TableCell className="text-right">{status?.value[0]?.confirmationStatus}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Confirmations</TableCell>
									<TableCell className="text-right">{status?.value[0]?.confirmations ?? 'MAX'}</TableCell>
								</TableRow>
							</>
						)}
						<TableRow>
							<TableCell className="font-medium">Slot</TableCell>
							<TableCell className="text-right">
								<Link href={`/block/${data?.slot}`}>{data?.slot}</Link>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Recent Blockhash</TableCell>
							<TableCell className="text-right">{data?.transaction?.message?.recentBlockhash}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Fee (SOL)</TableCell>
							<TableCell className="text-right">◎{data?.meta?.fee ? (Number(data?.meta.fee) / 1000000000).toFixed(6) : 'N/A'}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Compute Units Consumed</TableCell>
							<TableCell className="text-right">{data?.meta?.computeUnitsConsumed}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-medium">Transaction Version</TableCell>
							<TableCell className="text-right">{data?.version}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}