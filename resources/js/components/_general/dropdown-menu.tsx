import {DropdownMenu as DropdownMenuShadcn, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreVertical} from "lucide-react";

interface DropdownMenuItems {
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive";
}

interface Props {
    options: DropdownMenuItems[]
}
export function DropdownMenu({ options }: Props) {
    return (
        <DropdownMenuShadcn>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                    <MoreVertical />
                    <span className="sr-only">Abrir menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {options.map((option, index) => (
                    <DropdownMenuItem onClick={option.onClick} variant={option.variant ?? 'default'}>
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenuShadcn>
    )
}
