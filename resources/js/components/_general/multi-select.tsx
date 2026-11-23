import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon, X } from 'lucide-react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

interface MultiSelectOption {
    label: string;
    value: number;
}

interface Props {
    options: MultiSelectOption[];
    value?: number[];
    onValueChange?: (value: number[]) => void;
    name?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
    render?: (item: MultiSelectOption) => ReactNode;
}

export function MultiSelect({
    options = [],
    value = [],
    onValueChange,
    name = 'select',
    placeholder = 'Selecione...',
    searchPlaceholder = 'Pesquisar...',
    emptyMessage = 'Nenhum resultado encontrado',
    disabled = false,
    className,
    render,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<number[]>(value ?? []);

    function toggleOption(optionValue: number) {
        const newValue = selected.includes(optionValue)
            ? selected.filter((item) => item !== optionValue)
            : [...selected, optionValue];

        setSelected(newValue);
        onValueChange?.(newValue);
    }

    function getSelectedOptions() {
        return options.filter((option) => selected.includes(option.value));
    }

    const selectedOptions = getSelectedOptions();

    useEffect(() => {
        setSelected(value ?? []);
    }, [value]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    disabled={disabled}
                    className={cn(
                        'h-auto w-full justify-between font-normal hover:bg-neutral-900',
                        className,
                    )}
                >
                    {selected.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {selectedOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className="flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm font-medium text-neutral-400 hover:bg-neutral-700"
                                    onClick={() => toggleOption(option.value)}
                                >
                                    {!!render ? render(option) : option.label}
                                    <X className="size-3" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="truncate text-muted-foreground">
                            {placeholder}
                        </span>
                    )}

                    <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
            >
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />

                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>

                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selected.includes(
                                    option.value,
                                );

                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() =>
                                            toggleOption(option.value)
                                        }
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex size-4 items-center justify-center rounded-sm border',
                                                isSelected
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'opacity-50',
                                            )}
                                        >
                                            {isSelected && (
                                                <CheckIcon className="size-3" />
                                            )}
                                        </div>

                                        {!!render
                                            ? render(option)
                                            : option.label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
            {selected.map((sel) => (
                <input key={sel} type="hidden" name={`${name}[]`} value={sel} />
            ))}
        </Popover>
    );
}
