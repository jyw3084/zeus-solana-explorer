import { render, screen } from '@testing-library/react';
import AccountsCard from '../AccountsCard';
import { useTransaction } from '@/providers/transaction';
import { useParams } from 'next/navigation';

jest.mock('@/providers/transaction', () => ({
	useTransaction: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useParams: jest.fn(),
}));

describe('AccountsCard', () => {
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

		render(<AccountsCard />);

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

		render(<AccountsCard />);

		setTimeout(() => {
			expect(screen.getByText("Failed to load transaction information: Test error")).toBeInTheDocument();
		}, 1000);
	});

	it('renders accounts table', () => {
		(useTransaction as jest.Mock).mockReturnValue({
			transaction: {
				data: {
					transaction: {
						message: {
							accountKeys: [
								{ pubkey: 'address1', signer: true, writable: false },
								{ pubkey: 'address2', signer: false, writable: true },
							],
						},
					},
				},
			},
			getTransaction: jest.fn(),
			loading: false,
			error: null,
		});
		(useParams as jest.Mock).mockReturnValue({ signature: 'test-signature' });

		render(<AccountsCard />);

		const row1 = screen.getByText('address1').closest('tr');
		const row2 = screen.getByText('address2').closest('tr');
		expect(row1).toBeInTheDocument();
		expect(row2).toBeInTheDocument();
		expect(row1?.querySelectorAll('td')[1].textContent).toBe('No');
		expect(row1?.querySelectorAll('td')[2].textContent).toBe('Yes');
		expect(row2?.querySelectorAll('td')[1].textContent).toBe('Yes');
		expect(row2?.querySelectorAll('td')[2].textContent).toBe('No');
	});
});
