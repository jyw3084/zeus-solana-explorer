import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from '../ui/table';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { useTransaction } from '@/providers/transaction';
import { useParams } from 'next/navigation';

export default function InstructionsCard() {
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
						<div
							role="status"
							aria-label="Loading"
							className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
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
				<CardTitle>Instructions</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-left">Program ID</TableHead>
							<TableHead className="text-left">Instruction Data</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.transaction?.message?.instructions.map((instruction, index: number) => (
							<TableRow key={index}>
								<TableCell>
									{instruction.programId}
								</TableCell>
								<TableCell>
									{'data' in instruction
										? instruction.data
										: instruction.parsed?.type || 'N/A'}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}