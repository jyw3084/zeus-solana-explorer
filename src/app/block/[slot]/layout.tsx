import React from 'react';
import { BlockProvider } from '@/providers/block';

export default function BlockLayout({
	children
}: {
	children: React.ReactNode;
}
) {
	return (
		<BlockProvider>
			{children}
		</BlockProvider>
	);
};