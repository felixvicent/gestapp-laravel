import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, router, usePage} from "@inertiajs/react";
import {CategoryType} from "@/types/category-type";
import React from "react";
import {index} from "@/actions/App/Http/Controllers/CategoryController";
import {Select} from "@/components/_general/select";

interface Props {
    isOpen: boolean;
    onCloseModal: () => void;
}

interface CategoryFilters {
    search?: string;
    type?: string;
}

export function CategoryFilterModal({isOpen, onCloseModal}: Props){
    const { types, filters } = usePage<{ types: CategoryType[], filters?: CategoryFilters }>().props;

    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent className="sm:max-w-sm">
                <div className="space-y-6">
                    <Form
                        action={(index().url)}
                        method="GET"
                        options={{
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                        }}
                        className="space-y-6"
                        onSuccess={() => onCloseModal()}
                    >
                        {({processing}) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="search">Nome</Label>

                                    <Input
                                        id="search"
                                        className="mt-1 block w-full"
                                        name="search"
                                        placeholder="Nome da categoria"
                                        defaultValue={filters?.search ?? ''}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Tipo</Label>

                                    <Select
                                        name="type"
                                        value={filters?.type ?? 'ALL'}
                                        options={types.map(type => ({ value: type.value, label: type.label }))}
                                    />
                                </div>
                                <div className="flex items-center gap-4 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => onCloseModal()}
                                        type="button"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => router.get(index())}
                                        type="button"
                                    >
                                        Limpar
                                    </Button>
                                    <Button disabled={processing}>
                                        Filtrar
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
