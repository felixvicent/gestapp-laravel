import {Head} from "@inertiajs/react";
import {transactions} from "@/routes";
import {Button} from "@/components/ui/button";
import {Filter, Plus} from "lucide-react";
import {TransactionsTable} from "@/components/transactions/table";
import {PaginatedData} from "@/types/pagination";
import {useState} from "react";
import {TransactionDialogForm} from "@/components/transactions/dialog-form";
import {Transaction} from "@/types/transaction";
import {TransactionFilterModal} from "@/components/transactions/filter-modal";

interface Props {
    transactions: PaginatedData<Transaction>
}

export default function Transactions({ transactions }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    return (
        <>
            <Head title="Categorias" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsFilterModalOpen(true)}>
                        <Filter />
                        Filtros
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus/>
                        Adicionar transação
                    </Button>
                </div>

                <TransactionsTable transactions={transactions} />
            </div>
            <TransactionDialogForm
                isOpen={isCreateModalOpen}
                onCloseModal={() => setIsCreateModalOpen(false)}
            />
            <TransactionFilterModal isOpen={isFilterModalOpen} onCloseModal={() => setIsFilterModalOpen(false)} />
        </>
    )
}

Transactions.layout = {
    breadcrumbs: [
        {
            title: 'Transações',
            href: transactions()
        }
    ]
}
