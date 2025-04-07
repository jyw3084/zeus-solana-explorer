import { render } from '@testing-library/react';
import TransactionPage from '../page';
import AccountsCard from "@/components/transaction/AccountsCard";
import InstructionsCard from "@/components/transaction/InstructionsCard";
import LogsCard from "@/components/transaction/LogsCard";
import TransactionInfoCard from "@/components/transaction/TransactionInfoCard";

jest.mock('@/components/transaction/TransactionInfoCard');
jest.mock('@/components/transaction/AccountsCard');
jest.mock('@/components/transaction/InstructionsCard');
jest.mock('@/components/transaction/LogsCard');

describe('TransactionPage Component', () => {
	it('renders the transaction components', () => {
		render(<TransactionPage />);

		expect(TransactionInfoCard).toHaveBeenCalled();
		expect(AccountsCard).toHaveBeenCalled();
		expect(InstructionsCard).toHaveBeenCalled();
		expect(LogsCard).toHaveBeenCalled();
	});
});
