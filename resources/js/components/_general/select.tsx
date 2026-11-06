import {SelectContent, SelectItem, SelectTrigger, SelectValue, Select as SelectBase} from "@/components/ui/select";
import React from "react";

interface SelectOptions {
    label: string;
    value: string;
}

interface Props {
    value?: string;
    name?: string;
    placeholder?: string
    options: SelectOptions[]
}
export function Select({value, name, placeholder = "Selecione...", options}: Props) {
    return (
        <SelectBase name={name} defaultValue={value}>
            <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map(option => (
                    <SelectItem value={option.value}>{option.label}</SelectItem>
                ))}
            </SelectContent>
        </SelectBase>
    )
}
