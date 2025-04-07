import { render, screen } from '@testing-library/react';
import LogsCard from '../LogsCard';
import { useTransaction } from '@/providers/transaction';
import { useParams } from 'next/navigation';

jest.mock('@/providers/transaction', () => ({
	useTransaction: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useParams: jest.fn(),
}));

describe('LogsCard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders loading state', () => {
		(useTransaction as jest.Mock).mockReturnValue({
			transaction: {},
			getTransaction: jest.fn(),
			loading: true,
			error: null,
		});
		(useParams as jest.Mock).mockReturnValue({ signature: 'test-signature' });

		render(<LogsCard />);

		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('renders error state', () => {
		(useTransaction as jest.Mock).mockReturnValue({
			transaction: {},
			getTransaction: jest.fn(),
			loading: false,
			error: { message: 'Test error' },
		});
		(useParams as jest.Mock).mockReturnValue({ signature: 'test-signature' });

		render(<LogsCard />);

		setTimeout(() => {
			expect(screen.getByText("Failed to load transaction information: Test error")).toBeInTheDocument();
		}, 1000);
	});

	it('renders log messages', () => {
		(useTransaction as jest.Mock).mockReturnValue({
			transaction: {
				data: {
					meta: {
						logMessages: ['Log 1', 'Log 2'],
					},
				},
			},
			getTransaction: jest.fn(),
			loading: false,
			error: null,
		});
		(useParams as jest.Mock).mockReturnValue({ signature: 'test-signature' });

		render(<LogsCard />);

		expect(screen.getByText('Program Instruction Logs')).toBeInTheDocument();
		expect(screen.getByText('Log 1')).toBeInTheDocument();
		expect(screen.getByText('Log 2')).toBeInTheDocument();
	});
});
