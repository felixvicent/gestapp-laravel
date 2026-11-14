import {Head, router} from "@inertiajs/react";
import {categories} from "@/routes";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useState} from "react";
import {Category} from "@/types/category";
import {CategoryDialogForm} from "@/components/categories/dialog-form";
import {PaginatedData} from "@/types/pagination";
import {ColumnProps, Table} from "@/components/_general/table";
import {DropdownMenu} from "@/components/_general/dropdown-menu";
import {parseCategoryType} from "@/helpers/parse";
import {SelectOptions} from "@/types/select-options";
import {DeleteDialog} from "@/components/delete-dialog";
import {destroy} from "@/routes/categories";

interface Props {
    categories: PaginatedData<Category>,
    types: SelectOptions[]
}

export default function Categories({ categories, types } : Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategoryToUpdate, setSelectedCategoryToUpdate] = useState<Category | null>(null);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<Category | null>(null);

    function handleEditModalOpen(category: Category) {
        setSelectedCategoryToUpdate(category);
        setIsModalOpen(true);
    }

    function handleDeleteDialogOpen(category: Category) {
        setSelectedCategoryToDelete(category);
    }

    function handleDelete() {
        if(selectedCategoryToDelete == null) return;

        router.delete(destroy(selectedCategoryToDelete.id).url, {
            preserveScroll: true,
            onSuccess: () => setSelectedCategoryToDelete(null)
        })
    }

    const COLUMNS: ColumnProps<Category>[] = [
        { key: 'id', title: 'ID',  class: 'w-25' },
        { key: 'name', title: 'Nome' },
        { key: 'type', title: 'Tipo', render: (item) =>parseCategoryType(types, item.type) },
        {
            class: 'text-right',
            render: (category) => (
                <DropdownMenu
                    options={[
                        { label: 'Editar', onClick: () => handleEditModalOpen(category) },
                        { label: 'Apagar', onClick: () => handleDeleteDialogOpen(category), variant: 'destructive' }
                    ]}
                />
            )
        }
    ]

    return (
        <>
            <Head title="Categorias" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {categories.data.length > 0 && (
                    <div className="flex items-center justify-end gap-4">
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus/>
                            Adicionar categoria
                        </Button>
                    </div>
                )}

                <Table
                    columns={COLUMNS}
                    data={categories}
                    emptyProps={{
                        title: 'Nenhuma categoria cadastrada',
                        description: 'Organize suas receitas e despesas criando categorias personalizadas.',
                        actionText: 'Adicionar categoria',
                        action: () => setIsModalOpen(true)
                    }}
                />
            </div>
            <CategoryDialogForm
                isOpen={isModalOpen}
                onCloseModal={() => setIsModalOpen(false)}
                category={selectedCategoryToUpdate}
            />

            <DeleteDialog
                isOpen={!!selectedCategoryToDelete}
                onClose={() => setSelectedCategoryToDelete(null)}
                title="Apagar categoria"
                description={<span>Tem certeza que deseja excluir
                    <strong> {selectedCategoryToDelete?.name}</strong>?
                    Essa ação não poderá ser desfeita.</span>}
                onAction={handleDelete} />
        </>
    )
}

Categories.layout = {
    breadcrumbs: [
        {
            title: 'Categorias',
            href: categories()
        }
    ]
}
