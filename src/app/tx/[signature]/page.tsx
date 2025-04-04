import { getTransaction, getSignatureStatuses } from "@/server/data";
import { Signature } from "@solana/web3.js";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function TransactionPage({
	params,
}: {
	params: { signature: Signature },
}
) {
	const { signature } = await Promise.resolve(params);
	const data = await getTransaction(signature);
	const status = await getSignatureStatuses([signature])

	if (data == null || !status) return notFound();

	return (
		<main className="container mx-auto p-8">
			<div className="space-y-8">
				<Card>
					<CardHeader>
						<CardTitle>
							<h1 className="text-2xl font-bold">Transaction</h1>
						</CardTitle>
						{/* <CardDescription>Card Description</CardDescription> */}
					</CardHeader>
					<CardContent>
						{data && <Table>
							<TableBody>
								<TableRow>
									<TableCell className="font-medium">Signature</TableCell>
									<TableCell className="text-right">{data.transaction.signatures[0]}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Result</TableCell>
									<TableCell className="text-right">{data.meta?.err === null ? 'Success' : 'Error'}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Timestamp</TableCell>
									<TableCell className="text-right">{data.blockTime ? `${new Date(Number(data.blockTime) * 1000).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` : 'N/A'}</TableCell>
								</TableRow>
								{status.value[0] !== null && (
									<>
										<TableRow>
											<TableCell className="font-medium">Confirmation Status</TableCell>
											<TableCell className="text-right">{status.value[0]?.confirmationStatus}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">Confirmations</TableCell>
											<TableCell className="text-right">{status.value[0]?.confirmations ?? 'MAX'}</TableCell>
										</TableRow>
									</>
								)}
								<TableRow>
									<TableCell className="font-medium">Slot</TableCell>
									<TableCell className="text-right">
										<Link href={`/block/${data.slot}`}>{data.slot}</Link>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Recent Blockhash</TableCell>
									<TableCell className="text-right">{data.transaction?.message?.recentBlockhash}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Fee (SOL)</TableCell>
									<TableCell className="text-right">◎{data.meta?.fee ? (Number(data.meta.fee) / 1000000000).toFixed(6) : 'N/A'}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Compute Units Consumed</TableCell>
									<TableCell className="text-right">{data.meta?.computeUnitsConsumed}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Transaction Version</TableCell>
									<TableCell className="text-right">{data.version}</TableCell>
								</TableRow>
							</TableBody>
						</Table>}
					</CardContent>
				</Card>
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
								{data.transaction?.message?.accountKeys.map(({ pubkey, signer, writable }: { pubkey: string, signer: boolean, writable: boolean }, index: number) => (
									<TableRow key={index}>
										<TableCell>
											<Link href={`/account/${pubkey}`}>{pubkey}</Link>
										</TableCell>
										<TableCell>{!writable ? 'No' : 'Yes'}</TableCell>
										<TableCell className="text-center">{signer ? 'Yes' : 'No'}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
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
								{data.transaction?.message?.instructions.map((instruction, index: number) => (
									<TableRow key={index}>
										<TableCell>
											<Link href={`/program/${instruction.programId}`}>{instruction.programId}</Link>
										</TableCell>
										<TableCell>{instruction.data || 'N/A'}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
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
								{data.meta?.logMessages?.map((log: string, index: number) => (
									<TableRow key={index}>
										<TableCell>{index + 1}</TableCell>
										<TableCell>{log}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</main>
	)
}