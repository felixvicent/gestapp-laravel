import {
    Empty as EmptyShadcn,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty";
import {FolderCode} from "lucide-react";
import {Button} from "@/components/ui/button";

export interface EmptyProps {
    title?: string;
    description?: string;
    action?: () => void;
    actionText?: string;
}

export function Empty({ title = 'Nenhum resultado encontrado', description, action, actionText }: EmptyProps) {
    return (
        <EmptyShadcn>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FolderCode />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                {action && (
                    <Button onClick={action}>{actionText}</Button>
                )}
            </EmptyContent>
        </EmptyShadcn>
    )
}
