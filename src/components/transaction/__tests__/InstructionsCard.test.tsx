import { render, screen } from '@testing-library/react';
import InstructionsCard from '../InstructionsCard';
import { useTransaction } from '@/providers/transaction';
import { useParams } from 'next/navigation';

jest.mock('@/providers/transaction', () => ({
	useTransaction: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useParams: jest.fn(),
}));

describe('InstructionsCard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders loading state', () => {
		(useParams as jest.Mock).mockReturnValue({ signature: 'test-signature' });
		(useTransaction as jest.Mock).mockReturnValue({
			transaction: {},
			getTransaction: jest.fn(),
			loading: true,
			error: null,
		});

		render(<InstructionsCard />);

		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('renders error state', () => {
		(useParams as jest.Mock).mockReturnValue({ signature: 'test-signature' });
		(useTransaction as jest.Mock).mockReturnValue({
			transaction: {},
			getTransaction: jest.fn(),
			loading: false,
			error: { message: 'Test error' },
		});

		render(<InstructionsCard />);

		setTimeout(() => {
			expect(screen.getByText("Failed to load transaction information: Test error")).toBeInTheDocument();
		}, 1000);
	});

	it('renders instructions table', () => {
		(useParams as jest.Mock).mockReturnValue({ signature: 'test-signature' });
		(useTransaction as jest.Mock).mockReturnValue({
			transaction: {
				data: {
					transaction: {
						message: {
							instructions: [
								{ programId: 'Program1', data: 'Data1' },
								{ programId: 'Program2', parsed: { type: 'ParsedType' } },
							],
						},
					},
				},
			},
			getTransaction: jest.fn(),
			loading: false,
			error: null,
		});

		render(<InstructionsCard />);

		expect(screen.getByText('Program1')).toBeInTheDocument();
		expect(screen.getByText('Data1')).toBeInTheDocument();
		expect(screen.getByText('Program2')).toBeInTheDocument();
		expect(screen.getByText('ParsedType')).toBeInTheDocument();
	});
});
