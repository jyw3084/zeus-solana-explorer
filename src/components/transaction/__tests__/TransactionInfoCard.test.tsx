import { render, screen } from '@testing-library/react';
import TransactionInfo from '../TransactionInfoCard';
import { useTransaction } from '@/providers/transaction';
import { useParams } from 'next/navigation';

jest.mock('@/providers/transaction', () => ({
	useTransaction: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useParams: jest.fn(),
}));

describe('TransactionInfo', () => {
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

		render(<TransactionInfo />);

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

		render(<TransactionInfo />);

		setTimeout(() => {
			expect(screen.getByText("Failed to load transaction information: Text error")).toBeInTheDocument();
		}, 1000);
	});

	it('renders transaction data', () => {
		(useTransaction as jest.Mock).mockReturnValue({
			transaction: {
				data: {
					transaction: { signatures: ['test-signature'], message: { recentBlockhash: 'test-blockhash' } },
					meta: { err: null, fee: 5000, computeUnitsConsumed: 1000 },
					blockTime: 1672531200,
					slot: 12345,
					version: 'v0',
				},
				status: { value: [{ confirmationStatus: 'finalized', confirmations: 10 }] },
			},
			getTransaction: jest.fn(),
			loading: false,
			error: null,
		});
		(useParams as jest.Mock).mockReturnValue({ signature: 'test-signature' });

		render(<TransactionInfo />);

		expect(screen.getByText('Transaction')).toBeInTheDocument();
		expect(screen.getByText('test-signature')).toBeInTheDocument();
		expect(screen.getByText('Success')).toBeInTheDocument();
		expect(screen.getByText('12345')).toBeInTheDocument();
		expect(screen.getByText('test-blockhash')).toBeInTheDocument();
		expect(screen.getByText('◎0.000005')).toBeInTheDocument();
		expect(screen.getByText('1000')).toBeInTheDocument();
		expect(screen.getByText('v0')).toBeInTheDocument();
	});
});
