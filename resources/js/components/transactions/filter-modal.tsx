import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, router, usePage} from "@inertiajs/react";
import React from "react";
import {Category} from "@/types/category";
import {MultiSelect} from "@/components/_general/multi-select";
import {index} from "@/actions/App/Http/Controllers/TransactionController";
import {Select} from "@/components/_general/select";

interface Props {
    isOpen: boolean;
    onCloseModal: () => void;
}

interface CategoryFilters {
    search?: string;
    minValue?: number;
    maxValue?: number;
    categories?: number[];
    period?: string;
}

const PERIOD_OPTIONS = [
    {
        label: 'Mês atual',
        value: 'CURRENT_MONTH'
    },
    {
        label: 'Últimos 3 meses',
        value: 'LAST_3_MONTHS'
    },
    {
        label: 'Últimos 6 meses',
        value: 'LAST_6_MONTHS'
    },
    {
        label: 'Último ano',
        value: 'LAST_YEAR'
    }
];

export function TransactionFilterModal({isOpen, onCloseModal}: Props){
    const { filters, categories } = usePage<{ filters?: CategoryFilters, categories: Category[] }>().props;

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
                                        placeholder="Nome da transação"
                                        defaultValue={filters?.search ?? ''}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="minValue">Valor</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="minValue"
                                            className="mt-1 block w-full"
                                            name="minValue"
                                            placeholder="Valor minimo"
                                            defaultValue={filters?.minValue ?? ''}
                                        />
                                        <Input
                                            id="maxValue"
                                            className="mt-1 block w-full"
                                            name="maxValue"
                                            placeholder="Valor máximo"
                                            defaultValue={filters?.maxValue ?? ''}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type" className="mb-1">Categoria</Label>

                                    <MultiSelect
                                        options={categories.map(category => ({
                                            label: category.name,
                                            value: category.id,
                                        }))}
                                        value={filters?.categories ?? []}
                                        name="categories"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="period">Periodo</Label>

                                    <Select
                                        name="period"
                                        placeholder="Nome da transação"
                                        options={PERIOD_OPTIONS}
                                        value={filters?.period ?? 'last_10_days'}
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
