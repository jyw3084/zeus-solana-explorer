import { TransactionProvider } from '@/providers/transaction';
import React from 'react';

export default function TransactionLayout({
	children
}: {
	children: React.ReactNode;
}
) {
	return (
		<TransactionProvider>
			{children}
		</TransactionProvider>
	);
};