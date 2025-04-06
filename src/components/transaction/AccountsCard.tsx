import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from '../ui/table';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { useTransaction } from '@/providers/transaction';
import { useParams } from 'next/navigation';

export default function AccountsCard() {
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
				<CardTitle>Accounts</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-left">Address</TableHead>
							<TableHead className="text-left">Is Writable</TableHead>
							<TableHead className="text-center">Is Signer</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.transaction?.message?.accountKeys.map(({ pubkey, signer, writable }: { pubkey: string, signer: boolean, writable: boolean }, index: number) => (
							<TableRow key={index}>
								<TableCell>
									{pubkey}
								</TableCell>
								<TableCell>{!writable ? 'No' : 'Yes'}</TableCell>
								<TableCell className="text-center">{signer ? 'Yes' : 'No'}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}