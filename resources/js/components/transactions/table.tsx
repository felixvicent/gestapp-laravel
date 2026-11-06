import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {router} from "@inertiajs/react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreVertical} from "lucide-react";
import {useState} from "react";
import {DeleteDialog} from "@/components/delete-dialog";
import {Pagination} from "@/components/pagination";
import {PaginatedData} from "@/types/pagination";
import {Transaction} from "@/types/transaction";
import {formatDate} from "@/lib/date";
import {TransactionDialogForm} from "@/components/transactions/dialog-form";
import {formatCurrency} from "@/helpers/format";
import {destroy} from "@/routes/transactions";

interface Props {
    transactions: PaginatedData<Transaction>,
}

export function TransactionsTable({transactions}: Props) {
    const [selectedTransactionToUpdate, setSelectedTransactionToUpdate] = useState<Transaction | null>(null);
    const [selectedTransactionToDelete, setSelectedTransactionToDelete] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleDelete() {
        if (selectedTransactionToDelete == null) return;
        router.delete(destroy(selectedTransactionToDelete.id).url, {
            preserveScroll: true,
            onSuccess: () => setSelectedTransactionToDelete(null),
        });
    }

    return (
        <>
            <Table className="rounded-lg overflow-hidden">
                <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                        <TableHead className="w-25">ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.data.map(transaction => (
                        <TableRow key={transaction.id}>
                            <TableCell>{transaction.id}</TableCell>
                            <TableCell>{transaction.title}</TableCell>
                            <TableCell>{formatCurrency(transaction.value)}</TableCell>
                            <TableCell>{formatDate(transaction.date)}</TableCell>
                            <TableCell>{transaction.category.name}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <MoreVertical/>
                                            <span className="sr-only">Abrir menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => {
                                            setSelectedTransactionToUpdate(transaction);
                                            setIsModalOpen(true);
                                        }}>
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => setSelectedTransactionToDelete(transaction)}
                                        >
                                            Apagar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-end">
                <Pagination
                    links={transactions.links}
                    nextPageUrl={transactions.next_page_url}
                    prevPageUrl={transactions.prev_page_url}
                    lastPage={transactions.last_page}
                />
            </div>

            <TransactionDialogForm
                isOpen={isModalOpen}
                transaction={selectedTransactionToUpdate}
                onCloseModal={() => setIsModalOpen(false)}
            />
            <DeleteDialog
                isOpen={!!selectedTransactionToDelete}
                onClose={() => setSelectedTransactionToDelete(null)}
                title="Excluir categoria?"
                description={<span>Tem certeza que deseja excluir
                    <strong> {selectedTransactionToDelete?.title}</strong>?
                    Essa ação não poderá ser desfeita.</span>}
                onAction={handleDelete}/>
        </>
    )
}
