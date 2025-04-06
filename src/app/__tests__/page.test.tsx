import { render } from '@testing-library/react';
import Page from '../page';
import ClusterStatsCard from '@/components/ClusterStatsCard';
import BlocksCard from '@/components/BlocksCard';

jest.mock('@/components/ClusterStatsCard');
jest.mock('@/components/BlocksCard');

describe('Page Component', () => {
	it('renders the ClusterStatsCard and BlocksCard components', () => {
		render(<Page />);

		expect(ClusterStatsCard).toHaveBeenCalled();
		expect(BlocksCard).toHaveBeenCalled();
	});
});
