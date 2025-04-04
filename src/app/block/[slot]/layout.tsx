import React from 'react';
import { BlockProvider } from '@/providers/block';

interface LayoutProps {
	children: React.ReactNode;
	params: { slot: string };
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

	return (
		<BlockProvider>
			{children}
		</BlockProvider>
	);
};

export default Layout;