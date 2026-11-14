import {Head, router} from "@inertiajs/react";
import {tags} from "@/routes";
import {PaginatedData} from "@/types/pagination";
import {Tag} from "@/types/tag";
import {Button} from "@/components/ui/button";
import {Filter, Plus} from "lucide-react";
import {ColumnProps, Table} from "@/components/_general/table";
import {DialogForm} from "@/components/_general/dialog-form";
import {useState} from "react";
import {TagForm} from "@/components/tags/form";
import {Badge} from "@/components/ui/badge";
import {DropdownMenu} from "@/components/_general/dropdown-menu";
import {DeleteDialog} from "@/components/delete-dialog";
import {destroy} from "@/routes/tags";
import {getContrastColor} from "@/helpers/color";

interface Props {
    tags: PaginatedData<Tag>
}

export default function Tags({tags}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTagToUpdate, setSelectedTagToUpdate] = useState<Tag | null>(null);
    const [selectedTagToDelete, setSelectedTagToDelete] = useState<Tag | null>(null);

    function handleEditModalOpen(tag: Tag) {
        setSelectedTagToUpdate(tag);
        setIsModalOpen(true)
    }

    function handleDeleteDialogOpen(tag: Tag) {
        setSelectedTagToDelete(tag);
    }

    function handleDelete() {
        if(selectedTagToDelete == null) return;

        router.delete(destroy(selectedTagToDelete.id).url, {
            preserveScroll: true,
            onSuccess: () => setSelectedTagToDelete(null)
        })
    }

    const COLUMNS: ColumnProps<Tag>[] = [
        { key: 'id', title: 'ID', class: 'w-25' },
        {
            key: 'name',
            title: 'Nome',
            render: (tag) => (
                <Badge style={{ backgroundColor: tag.color, color: getContrastColor(tag.color) }}>{tag.name}</Badge>
            )
        },
        {
            class: 'text-right',
            render: (tag: Tag) => (
                <DropdownMenu
                    options={[
                        { label: 'Editar', onClick: () => handleEditModalOpen(tag) },
                        { label: 'Apagar', onClick: () => handleDeleteDialogOpen(tag), variant: 'destructive' },
                    ]}
                />
            )
        }
    ]

    return (
        <>
            <Head title="Tags" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {tags.data.length > 0 && (
                    <div className="flex items-center justify-end gap-4">
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus />
                            Adicionar tag
                        </Button>
                    </div>
                )}

                <Table columns={COLUMNS} data={tags} emptyProps={{
                    title: 'Nenhuma tag cadastrada',
                    description: 'Você ainda não criou nenhuma tag. Crie tags para identificar e organizar suas transações com mais facilidade.',
                    actionText: 'Adicionar tag',
                    action: () => setIsModalOpen(true),
                }} />
            </div>

            <DialogForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={!!selectedTagToUpdate ? "Editar tag" : "Criar tag"}
                form={<TagForm onCancel={() => setIsModalOpen(false)} tag={selectedTagToUpdate} />}
            />

            <DeleteDialog
                isOpen={!!selectedTagToDelete}
                onClose={() => setSelectedTagToDelete(null)}
                title="Apagar categoria"
                description={<span>Tem certeza que deseja excluir
                    <strong> {selectedTagToDelete?.name}</strong>?
                    Essa ação não poderá ser desfeita.</span>}
                onAction={handleDelete} />
        </>
    )
}

Tags.layout = {
    breadcrumbs: [
        {
            title: 'Tags',
            href: tags()
        }
    ]
}
