import { Dialog, DialogContent } from '@/components/ui/dialog';
import Heading from '@/components/heading';
import { ReactNode } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    form: ReactNode;
    title?: string;
}

export function DialogForm({ isOpen, onClose, form, title }: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <div className="space-y-6">
                    <Heading title={title ?? ''} variant="small" />

                    {form}
                </div>
            </DialogContent>
        </Dialog>
    );
}
