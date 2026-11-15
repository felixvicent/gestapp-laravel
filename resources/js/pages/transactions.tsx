import {Head, router} from "@inertiajs/react";
import {transactions} from "@/routes";
import {Button} from "@/components/ui/button";
import {Filter, Plus} from "lucide-react";
import {PaginatedData} from "@/types/pagination";
import {useState} from "react";
import {TransactionDialogForm} from "@/components/transactions/dialog-form";
import {Transaction} from "@/types/transaction";
import {TransactionFilterModal} from "@/components/transactions/filter-modal";
import {ColumnProps, Table} from "@/components/_general/table";
import {formatCurrency} from "@/helpers/format";
import {formatDate} from "@/lib/date";
import {DropdownMenu} from "@/components/_general/dropdown-menu";
import {DeleteDialog} from "@/components/delete-dialog";
import {destroy} from "@/routes/transactions";
import {Badge} from "@/components/ui/badge";
import {getContrastColor} from "@/helpers/color";

interface Props {
    transactions: PaginatedData<Transaction>
}

export default function Transactions({ transactions }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedTransactionToUpdate, setSelectedTransactionToUpdate] = useState<Transaction | null>(null);
    const [selectedTransactionToDelete, setSelectedTransactionToDelete] = useState<Transaction | null>(null);

    function handleEditModalOpen(transaction: Transaction){
        setSelectedTransactionToUpdate(transaction);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setSelectedTransactionToUpdate(null);
        setIsModalOpen(false);
    }

    function handleDeleteDialogOpen(transaction: Transaction){
        setSelectedTransactionToDelete(transaction);
    }

    function handleDelete(){
        if(selectedTransactionToDelete == null) return;

        router.delete(destroy(selectedTransactionToDelete.id).url, {
            preserveScroll: true,
            onSuccess: () => setSelectedTransactionToDelete(null)
        })
    }

    const COLUMNS: ColumnProps<Transaction>[] = [
        { key: 'id', title: 'ID', class: 'w-25' },
        { key: 'title', title: 'Nome', render: (transaction) => (
            <div className="flex flex-col gap-2">
                {transaction.title}
                <div className="flex flex-wrap gap-1">
                    {transaction.tags.map((tag) => (
                        <Badge
                            key={tag.id}
                            className="px-1.5 py-0 text-[10px] leading-4"
                            style={{backgroundColor: tag.color, color: getContrastColor(tag.color)}}>
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            </div>
            ) },
        { key: 'value', title: 'Valor', render: (transaction) => formatCurrency(transaction.value) },
        { key: 'date', title: 'Data', render: (transaction) => formatDate(transaction.date) },
        { key: 'category', title: 'Categoria',  render: (transaction) => transaction.category.name},
        {
            class: 'text-right',
            render: (transaction) => (
                <DropdownMenu options={[
                    { label: 'Editar', onClick: () => handleEditModalOpen(transaction) },
                    { label: 'Apagar', variant: 'destructive', onClick: () => handleDeleteDialogOpen(transaction) }
                ]} />
            )
        }
    ];

    return (
        <>
            <Head title="Transações" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {transactions.data.length > 0 && (
                    <div className="flex items-center justify-end gap-4">
                        <Button variant="outline" onClick={() => setIsFilterModalOpen(true)}>
                            <Filter />
                            Filtros
                        </Button>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus/>
                            Adicionar transação
                        </Button>
                    </div>
                )}

                <Table
                    columns={COLUMNS}
                    data={transactions}
                    emptyProps={{
                        title: 'Nenhuma transação encontrada',
                        description: 'Você ainda não possui transações cadastradas. Comece adicionando sua primeira receita ou despesa.',
                        actionText: 'Adicionar transação',
                        action: () => setIsModalOpen(true)
                    }}
                />
            </div>
            <TransactionDialogForm
                isOpen={isModalOpen}
                onCloseModal={handleCloseModal}
                transaction={selectedTransactionToUpdate}
            />
            <TransactionFilterModal
                isOpen={isFilterModalOpen}
                onCloseModal={() => setIsFilterModalOpen(false)}
            />
            <DeleteDialog
                isOpen={!!selectedTransactionToDelete}
                onClose={() => setSelectedTransactionToDelete(null)}
                title="Apagar transação?"
                description={<span>Tem certeza que deseja excluir
                    <strong> {selectedTransactionToDelete?.title}</strong>?
                    Essa ação não poderá ser desfeita.</span>}
                onAction={handleDelete}
            />
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
