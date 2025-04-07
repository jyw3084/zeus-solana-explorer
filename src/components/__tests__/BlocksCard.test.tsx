import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlocksCard from '../BlocksCard';
import { useCluster } from '@/providers/cluster';
import { getBlocksWithLimit, getSingleBlockTime } from '@/server/data';

jest.mock('@/providers/cluster', () => ({
	useCluster: jest.fn(),
}));

jest.mock('@/server/data', () => ({
	getBlocksWithLimit: jest.fn(),
	getSingleBlockTime: jest.fn(),
}));

describe('BlocksCard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders loading state', () => {
		(useCluster as jest.Mock).mockReturnValue({ loading: true, epochInfo: null, error: null });

		render(<BlocksCard />);
		expect(screen.getByText('Blocks')).toBeInTheDocument();
		expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
	});

	it('renders error state', () => {
		(useCluster as jest.Mock).mockReturnValue({ loading: false, epochInfo: null, error: true });

		render(<BlocksCard />);
		expect(screen.getByText('Failed to load blocks')).toBeInTheDocument();
	});

	it('renders blocks', async () => {
		(useCluster as jest.Mock).mockReturnValue({
			loading: false,
			epochInfo: { absoluteSlot: BigInt(1000) },
			error: null,
		});

		(getBlocksWithLimit as jest.Mock).mockResolvedValue([BigInt(999), BigInt(998)]);

		render(<BlocksCard />);

		await waitFor(() => expect(screen.getByText('999')).toBeInTheDocument());
	});

	it('handles sorting by timestamp', async () => {
		(useCluster as jest.Mock).mockReturnValue({
			loading: false,
			epochInfo: { absoluteSlot: BigInt(1000) },
			error: null,
		});

		(getSingleBlockTime as jest.Mock).mockResolvedValueOnce(1630000000).mockResolvedValueOnce(1630000100);

		render(<BlocksCard />);

		const timestampHeader = screen.getByText('Timestamp');
		fireEvent.click(timestampHeader);

		await waitFor(() => {
			const rows = screen.getAllByRole('row');
			expect(rows[1].textContent).toContain('8/27/2021, 1:46:40 AM');
		});
	});

	it('handles "Load More" functionality', async () => {
		(useCluster as jest.Mock).mockReturnValue({
			loading: false,
			epochInfo: { absoluteSlot: BigInt(1000) },
			error: null,
		});

		(getBlocksWithLimit as jest.Mock)
			.mockResolvedValueOnce([BigInt(999), BigInt(998)])
			.mockResolvedValueOnce([BigInt(997), BigInt(996)]);
		(getSingleBlockTime as jest.Mock)
			.mockResolvedValueOnce(1630000000)
			.mockResolvedValueOnce(1630000100)
			.mockResolvedValueOnce(1630000200)
			.mockResolvedValueOnce(1630000300);

		render(<BlocksCard />);

		await waitFor(() => expect(screen.getByText('999')).toBeInTheDocument());

		const loadMoreButton = screen.getByText('Load More');
		fireEvent.click(loadMoreButton);

		await waitFor(() => expect(screen.getByText('997')).toBeInTheDocument());
		expect(screen.getByText('996')).toBeInTheDocument();
	});
});
