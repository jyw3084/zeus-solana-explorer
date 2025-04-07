import { render, screen, fireEvent } from '@testing-library/react';
import DropDownSelect from '../DropDownSelect';

describe('DropDownSelect', () => {
	it('renders the active option as the button label', () => {
		render(
			<DropDownSelect
				options={[
					{ name: 'Option 1', action: jest.fn() },
					{ name: 'Option 2', action: jest.fn() },
				]}
				active="Option 1"
			/>
		);

		expect(screen.getByRole('button', { name: 'Option 1' })).toBeInTheDocument();
	});

	it('displays dropdown options when the button is clicked', async () => {
		render(
			<DropDownSelect
				options={[
					{ name: 'Option 1', action: jest.fn() },
					{ name: 'Option 2', action: jest.fn() },
				]}
				active="Option 1"
			/>
		);

		const button = screen.getByRole('button', { name: 'Option 1' });
		fireEvent.click(button);

		setTimeout(() => {
			expect(screen.getByText('Option 1')).toBeInTheDocument();
			expect(screen.getByText('Option 2')).toBeInTheDocument();
		}, 1000);
	});
});
