import {Dialog, DialogContent} from "@/components/ui/dialog";
import Heading from "@/components/heading";
import {TransactionForm} from "@/components/transactions/form";
import {Transaction} from "@/types/transaction";

interface Props {
    isOpen: boolean,
    onCloseModal: () => void,
    transaction?: Transaction | null,
}
export function TransactionDialogForm({onCloseModal, isOpen, transaction}: Props){
    const isEditing = transaction != null;
    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent className="sm:max-w-sm">
                <div className="space-y-6">
                    <Heading title={isEditing ? "Editar transação" : "Criar transação"} variant="small" />

                    <TransactionForm transaction={transaction} onCancel={onCloseModal} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
