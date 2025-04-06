import { render, screen } from '@testing-library/react';
import BlockInfoCard from '../BlockInfoCard';
import { useBlock } from '@/providers/block';
import { FetchStatus } from '@/utils/types';
import { useParams } from 'next/navigation';

jest.mock('@/providers/block', () => ({
	useBlock: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useParams: jest.fn(),
}));

describe('BlockInfoCard', () => {
	it('renders loading state', () => {
		(useParams as jest.Mock).mockReturnValue({ slot: '12345' });
		(useBlock as jest.Mock).mockReturnValue({
			blockInfo: null,
			getBlock: jest.fn(),
			status: FetchStatus.Fetching,
		});

		render(<BlockInfoCard />);

		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('renders error state', () => {
		(useParams as jest.Mock).mockReturnValue({ slot: '12345' });
		(useBlock as jest.Mock).mockReturnValue({
			blockInfo: null,
			getBlock: jest.fn(),
			status: FetchStatus.FetchFailed,
		});

		render(<BlockInfoCard />);

		expect(screen.getByText('Failed to load block information')).toBeInTheDocument();
	});

	it('renders block information', () => {
		(useParams as jest.Mock).mockReturnValue({ slot: '12345' });
		(useBlock as jest.Mock).mockReturnValue({
			blockInfo: {
				block: {
					blockhash: 'abc123',
					blockTime: 1672531200,
					blockHeight: 100,
					parentSlot: 99,
					transactions: [{}, {}],
				},
				blockLeader: 'Leader1',
				parentLeader: 'Leader0',
				childLeader: 'Leader2',
				childSlot: 101,
			},
			getBlock: jest.fn(),
			status: FetchStatus.Fetched,
		});

		render(<BlockInfoCard />);

		expect(screen.getByText("Block 12345")).toBeInTheDocument();
		expect(screen.getByText("abc123")).toBeInTheDocument();
		expect(screen.getByText("Leader1")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
	});
});
