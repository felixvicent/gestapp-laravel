import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Category} from "@/types/category";
import {router, usePage} from "@inertiajs/react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreVertical} from "lucide-react";
import {useState} from "react";
import {DeleteDialog} from "@/components/delete-dialog";
import {destroy} from "@/actions/App/Http/Controllers/CategoryController";
import {CategoryDialogForm} from "@/components/categories/dialog-form";
import {Pagination} from "@/components/pagination";
import {PaginatedData} from "@/types/pagination";
import {SelectOptions} from "@/types/select-options";

interface Props {
    categories: PaginatedData<Category>
}
export function CategoryTable({categories}: Props){
    const [selectedCategoryToUpdate, setSelectedCategoryToUpdate] = useState<Category | null>(null);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<Category | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { types } = usePage<{ types: SelectOptions[] }>().props

    function parseCategoryType(categoryType: string){
        return types.find(type => type.value === categoryType)?.label;
    }

    function handleDelete(){
        if(selectedCategoryToDelete == null) return;
        router.delete(destroy(selectedCategoryToDelete.id).url, {
            preserveScroll: true,
            onSuccess: () => setSelectedCategoryToDelete(null),
        });
    }

    return (
        <>
            <Table className="rounded-lg overflow-hidden">
                <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                        <TableHead className="w-25">ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.data.map(category => (
                        <TableRow key={category.id}>
                            <TableCell>{category.id}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{parseCategoryType(category.type)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <MoreVertical />
                                            <span className="sr-only">Abrir menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => {
                                            setSelectedCategoryToUpdate(category);
                                            setIsModalOpen(true);
                                        }}>
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => setSelectedCategoryToDelete(category)}
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
                    links={categories.links}
                    nextPageUrl={categories.next_page_url}
                    prevPageUrl={categories.prev_page_url}
                    lastPage={categories.last_page}
                />
            </div>

            <CategoryDialogForm
                isOpen={isModalOpen}
                category={selectedCategoryToUpdate}
                onCloseModal={() => setIsModalOpen(false)}
            />
            <DeleteDialog
                isOpen={!!selectedCategoryToDelete}
                onClose={() => setSelectedCategoryToDelete(null)}
                title="Excluir categoria?"
                description={<span>Tem certeza que deseja excluir
                    <strong> {selectedCategoryToDelete?.name}</strong>?
                    Essa ação não poderá ser desfeita.</span>}
                onAction={handleDelete} />
        </>
    )
}
