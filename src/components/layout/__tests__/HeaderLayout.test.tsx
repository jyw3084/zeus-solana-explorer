import { render, fireEvent, screen } from "@testing-library/react";
import HeaderLayout from "../HeaderLayout";
import { useRouter } from "next/navigation";
import { useNetwork } from "@/lib/network";

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

jest.mock("@/lib/network", () => ({
	useNetwork: jest.fn(),
}));

describe("HeaderLayout", () => {
	const mockPush = jest.fn();
	const mockChangeNetwork = jest.fn();

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
		(useNetwork as jest.Mock).mockReturnValue({
			network: "Mainnet",
			changeNetwork: mockChangeNetwork,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders children correctly", () => {
		render(
			<HeaderLayout>
				<div>Test Child</div>
			</HeaderLayout>
		);
		expect(screen.getByText("Test Child")).toBeInTheDocument();
	});

	it("updates search term and shows search result", async () => {
		render(<HeaderLayout>{null}</HeaderLayout>);

		const input = screen.getByPlaceholderText("Search block or transaction...");
		fireEvent.change(input, { target: { value: "123456789" } });

		expect(input).toHaveValue("123456789");
		expect(await screen.findByText("Block")).toBeInTheDocument();
		expect(await screen.findByText("123456789")).toBeInTheDocument();
	});

	it("navigates to the correct path on search result click", async () => {
		render(<HeaderLayout>{null}</HeaderLayout>);

		const input = screen.getByPlaceholderText("Search block or transaction...");
		fireEvent.change(input, { target: { value: "123456789" } });

		const result = await screen.findByText("123456789");
		fireEvent.click(result);

		expect(mockPush).toHaveBeenCalledWith("/block/123456789");
	});

	it("handles invalid search input", async () => {
		render(<HeaderLayout>{null}</HeaderLayout>);

		const input = screen.getByPlaceholderText("Search block or transaction...");
		fireEvent.change(input, { target: { value: "invalid-input" } });

		const invalidType = await screen.findByText("Invalid", { selector: "p.text-sm" });
		const invalidValue = await screen.findByText("Invalid", { selector: "p.text-md" });

		expect(invalidType).toBeInTheDocument();
		expect(invalidValue).toBeInTheDocument();
	});

	it("changes network using dropdown", () => {
		render(<HeaderLayout>{null}</HeaderLayout>);

		const dropdown = screen.getByText("Mainnet");
		fireEvent.click(dropdown);

		setTimeout(() => {
			const devnetOption = screen.getByText("Devnet");
			fireEvent.click(devnetOption);
			expect(mockChangeNetwork).toHaveBeenCalledWith("Devnet");
		}, 1000);
	});
});
