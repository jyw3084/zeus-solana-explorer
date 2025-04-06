"use client";

import { getSignatureStatuses, getTransaction } from "@/server/data";
import { Signature } from "@solana/web3.js";
import { createContext, useContext, ReactNode, useState } from "react";

const TransactionContext = createContext(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
	const [transaction, setTransaction] = useState({
		data: undefined,
		status: undefined,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchTransaction = async (signature: Signature) => {
		setLoading(true);

		try {
			const [data, status] = await Promise.all([
				getTransaction(signature),
				getSignatureStatuses([signature])
			]);

			setTransaction(prev => ({
				...prev,
				data,
				status,
			}));
			setLoading(false);
		} catch (err) {
			setError(err as Error);
			setLoading(false);
		}
	}

	return (
		<TransactionContext.Provider value={{
			transaction,
			getTransaction: fetchTransaction,
			loading,
			error,
		}}>
			{children}
		</TransactionContext.Provider>
	);
}

export function useTransaction() {
	const context = useContext(TransactionContext);
	if (context === undefined) {
		throw new Error("useTransaction must be used within a TransactionProvider");
	}
	return context;
}