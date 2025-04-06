import { render, screen, fireEvent } from '@testing-library/react';
import TransactionsCard from '../TransactionsCard';
import { useBlock } from '@/providers/block';
import { useParams } from 'next/navigation';
import { FetchStatus } from '@/utils/types';

jest.mock('@/providers/block', () => ({
	useBlock: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useParams: jest.fn(),
}));

describe('TransactionsCard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders loading state when fetching', () => {
		(useBlock as jest.Mock).mockReturnValue({
			blockInfo: null,
			getBlock: jest.fn(),
			status: FetchStatus.Fetching,
		});
		(useParams as jest.Mock).mockReturnValue({ slot: '12345' });

		render(<TransactionsCard />);

		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('renders error state when fetch fails', () => {
		(useBlock as jest.Mock).mockReturnValue({
			blockInfo: null,
			getBlock: jest.fn(),
			status: FetchStatus.FetchFailed,
		});
		(useParams as jest.Mock).mockReturnValue({ slot: '12345' });

		render(<TransactionsCard />);

		expect(screen.getByText('Failed to load transactions')).toBeInTheDocument();
	});

	it('renders transactions table when data is available', () => {
		(useBlock as jest.Mock).mockReturnValue({
			blockInfo: {
				block: {
					transactions: [
						{
							transaction: { signatures: ['signature1'] },
							meta: { err: null, fee: 5000, computeUnitsConsumed: 100 },
						},
					],
				},
			},
			getBlock: jest.fn(),
			status: FetchStatus.Fetched,
		});
		(useParams as jest.Mock).mockReturnValue({ slot: '12345' });

		render(<TransactionsCard />);

		expect(screen.getByText('Transactions')).toBeInTheDocument();
		expect(screen.getByText('Success')).toBeInTheDocument();
		expect(screen.getByText('5000')).toBeInTheDocument();
		expect(screen.getByText('100')).toBeInTheDocument();
	});

	it('loads more transactions when "Load More" button is clicked', () => {
		const transactions = Array.from({ length: 50 }, (_, i) => ({
			transaction: { signatures: [`signature${i}`] },
			meta: { err: null, fee: 5000, computeUnitsConsumed: 100 },
		}));

		(useBlock as jest.Mock).mockReturnValue({
			blockInfo: { block: { transactions } },
			getBlock: jest.fn(),
			status: FetchStatus.Fetched,
		});
		(useParams as jest.Mock).mockReturnValue({ slot: '12345' });

		render(<TransactionsCard />);

		expect(screen.getAllByRole('row')).toHaveLength(41); // 40 transactions + header row

		const loadMoreButton = screen.getByText('Load More');
		fireEvent.click(loadMoreButton);

		expect(screen.getAllByRole('row')).toHaveLength(51); // 50 transactions + header row
	});
});
