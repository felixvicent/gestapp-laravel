import {Dialog, DialogContent} from "@/components/ui/dialog";
import Heading from "@/components/heading";
import {Category} from "@/types/category";
import {CategoryForm} from "@/components/categories/form";

interface Props {
    isOpen: boolean,
    onCloseModal: () => void,
    category?: Category | null,
}
export function CategoryDialogForm({onCloseModal, isOpen, category}: Props){
    const isEditing = category != null;
    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent className="sm:max-w-sm">
                <div className="space-y-6">
                    <Heading title={isEditing ? "Editar categoria" : "Criar categoria"} variant="small" />

                    <CategoryForm category={category} onCancel={onCloseModal} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
