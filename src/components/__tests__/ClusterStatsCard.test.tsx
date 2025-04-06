import { render, screen } from '@testing-library/react';
import ClusterStatsCard from '../ClusterStatsCard';
import { useCluster } from '@/providers/cluster';

jest.mock('@/providers/cluster', () => ({
	useCluster: jest.fn(),
}));

describe('ClusterStatsCard Component', () => {
	it('renders loading state', () => {
		(useCluster as jest.Mock).mockReturnValue({ loading: true, epochInfo: null, samples: null, error: null });
		render(<ClusterStatsCard />);
		expect(screen.getByText('Live Cluster Stats')).toBeInTheDocument();
		expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
	});

	it('renders error state', () => {
		(useCluster as jest.Mock).mockReturnValue({ loading: false, epochInfo: null, samples: null, error: { message: 'Failed to fetch data' } });
		render(<ClusterStatsCard />);
		expect(screen.getByText('Live Cluster Stats')).toBeInTheDocument();
		expect(screen.getByText('Failed to load cluster stats: Failed to fetch data')).toBeInTheDocument();
	});

	it('renders data correctly', () => {
		(useCluster as jest.Mock).mockReturnValue({
			loading: false,
			error: null,
			epochInfo: {
				absoluteSlot: 12345,
				blockHeight: 67890,
				epoch: 1,
				slotIndex: 50,
				slotsInEpoch: 100,
			},
			samples: [
				{ numSlots: BigInt(10), samplePeriodSecs: 40 },
				{ numSlots: BigInt(20), samplePeriodSecs: 80 },
			],
		});
		render(<ClusterStatsCard />);
		expect(screen.getByText('Live Cluster Stats')).toBeInTheDocument();
		expect(screen.getByText('12345')).toBeInTheDocument(); // Slot
		expect(screen.getByText('67890')).toBeInTheDocument(); // Block Height
		expect(screen.getByText('50.00% complete')).toBeInTheDocument(); // Epoch Progress
	});
});
