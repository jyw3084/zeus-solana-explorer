import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from '../ui/table';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { useTransaction } from '@/providers/transaction';
import { useParams } from 'next/navigation';

export default function LogsCard() {
	const { signature } = useParams();
	const { transaction, getTransaction, loading, error } = useTransaction();
	const { data } = transaction;

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
				<CardTitle>Program Instruction Logs</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-left"></TableHead>
							<TableHead className="text-left">Log Message</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.meta?.logMessages?.map((log: string, index: number) => (
							<TableRow key={index}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{log}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}