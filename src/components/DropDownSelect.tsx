import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";


export default function DropDownSelect({
	options,
	active
}: {
	options: {
		name: string;
		action: () => void;
	}[],
	active: string
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">{active}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{options.map((option) => (
					<DropdownMenuItem
						key={option.name}
						onClick={() => {
							option.action();
						}}
					>
						{option.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>

	)
}