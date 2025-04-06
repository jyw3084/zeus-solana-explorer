import { render } from '@testing-library/react';
import BlockPage from '../page';
import BlockInfoCard from '@/components/BlockInfoCard';
import TransactionsCard from '@/components/TransactionsCard';

jest.mock('@/components/BlockInfoCard');
jest.mock('@/components/TransactionsCard');

describe('BlockPage Component', () => {
	it('renders the BlockInfoCard and TransactionsCard components', () => {
		render(<BlockPage />);

		expect(BlockInfoCard).toHaveBeenCalled();
		expect(TransactionsCard).toHaveBeenCalled();
	});
});
