"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { SearchResult } from "@/utils/types";
import DropDownSelect from "../DropDownSelect";
import { useNetwork } from "@/lib/network";


export default function HeaderLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { network, changeNetwork } = useNetwork();

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

	const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		if (value.length > 0) {
			await identifySearchType(value);
		} else {
			setSearchResult(null);
		}
	};

	const identifySearchType = (value: string) => {
		const transactionPattern = /^[1-9A-HJ-NP-Za-km-z]{88}$/; // Solana transaction signature pattern
		const blockPattern = /^\d+$/; // Block number pattern

		if (transactionPattern.test(value)) {
			setSearchResult({ type: "Transaction", value });
		} else if (blockPattern.test(value)) {
			setSearchResult({ type: "Block", value });
		} else {
			setSearchResult({ type: "Invalid", value: "Invalid" });
		}
	};

	const handleResultClick = () => {
		if (searchResult && searchResult.type !== "Invalid") {
			const { type, value } = searchResult;
			const path = `/${type === 'Transaction' ? 'tx' : 'block'}/${value}`;
			router.push(path);
		}
		setSearchTerm("");
		setSearchResult(null);
	};

	const dropDownOptions = [
		{
			name: "Mainnet",
			action: () => changeNetwork("Mainnet"),
		},
		{
			name: "Devnet",
			action: () => changeNetwork("Devnet"),
		},
	];

	return (
		<div className="h-[100%] overflow-hidden flex flex-col relative">
			<div className="between border-b border-[#E5E7EB] dark:border-[#374151] bg-whiteBg dark:bg-darkBg text-white-text dark:text-dark-text px-5 h-[80px]">
				<div className="container mx-auto p-8 flex justify-between items-center">
					<div className="relative">
						<Input
							onChange={handleSearchChange}
							value={searchTerm}
							placeholder="Search block or transaction..."
							className="w-[450px] border border-[#D1D5DB] dark:border-[#4B5563] rounded-[8px] text-white"
						/>
						{searchResult && (
							<div
								className="absolute min-w-[450px] bg-white dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-[#D1D5DB] dark:border-[#4B5563] rounded-[8px] mt-1 p-4 cursor-pointer"
								onClick={handleResultClick}
							>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{searchResult.type}
								</p>
								<p className="text-md text-black dark:text-white">
									{searchResult.value}
								</p>
							</div>
						)}
					</div>
					<div>
						<DropDownSelect
							options={dropDownOptions}
							active={network}
						/>
					</div>
				</div>
			</div>
			<div
				className="w-full bg-background flex flex-row"
				style={{ height: "calc(100vh - 80px)" }}
			>
				<div className="bg-background w-full overflow-y-scroll">{children}</div>
			</div>
		</div>
	);
};