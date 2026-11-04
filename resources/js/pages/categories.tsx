import {Head} from "@inertiajs/react";
import {categories} from "@/routes";
import {Button} from "@/components/ui/button";
import {Filter, Plus} from "lucide-react";
import {useState} from "react";
import {Category} from "@/types/category";
import {CategoryDialogForm} from "@/components/categories/dialog-form";
import {PaginatedData} from "@/types/pagination";
import {CategoryTable} from "@/components/categories/table";
import {CategoryFilterModal} from "@/components/categories/filter-modal";

interface Props {
    categories: PaginatedData<Category>,
}

export default function Categories({ categories } : Props) {
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
                        Adicionar categoria
                    </Button>
                </div>

                <CategoryTable categories={categories} />
            </div>
            <CategoryDialogForm
                isOpen={isCreateModalOpen}
                onCloseModal={() => setIsCreateModalOpen(false)}
            />
            <CategoryFilterModal
                isOpen={isFilterModalOpen}
                onCloseModal={() => setIsFilterModalOpen(false)}
            />
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
