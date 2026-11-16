import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, router, usePage } from '@inertiajs/react';
import React from 'react';
import { Category } from '@/types/category';
import { MultiSelect } from '@/components/_general/multi-select';
import { index } from '@/actions/App/Http/Controllers/TransactionController';
import { Select } from '@/components/_general/select';
import InputError from '@/components/input-error';
import { SelectOptions } from '@/types/select-options';
import { Tag } from '@/types/tag';
import { Badge } from '@/components/ui/badge';
import { getContrastColor } from '@/helpers/color';

interface Props {
    isOpen: boolean;
    onCloseModal: () => void;
}

interface TransactionFilters {
    search?: string;
    minValue?: number;
    maxValue?: number;
    categories?: number[];
    beginDate?: string;
    endDate?: string;
}

export function TransactionFilterModal({ isOpen, onCloseModal }: Props) {
    const { filters, categories, tags, errors } = usePage<{
        filters?: TransactionFilters;
        categories: Category[];
        tags: Tag[];
    }>().props;

    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent className="sm:max-w-sm">
                <div className="space-y-6">
                    <Form
                        action={index().url}
                        method="GET"
                        options={{
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                        }}
                        className="space-y-6"
                        onSuccess={() => onCloseModal()}
                    >
                        {({ processing }) => (
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

                                    <InputError
                                        className="mt-2"
                                        message={errors.search}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="minValue">Valor</Label>
                                    <div className="flex gap-2">
                                        <div>
                                            <Input
                                                id="minValue"
                                                className="mt-1 block w-full"
                                                name="minValue"
                                                placeholder="Valor minimo"
                                                defaultValue={
                                                    filters?.minValue ?? ''
                                                }
                                                type="number"
                                                step="0.01"
                                            />
                                            <InputError
                                                className="mt-2"
                                                message={errors.minValue}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                id="maxValue"
                                                className="mt-1 block w-full"
                                                name="maxValue"
                                                placeholder="Valor máximo"
                                                defaultValue={
                                                    filters?.maxValue ?? ''
                                                }
                                                type="number"
                                                step="0.01"
                                            />
                                            <InputError
                                                className="mt-2"
                                                message={errors.maxValue}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-1 gap-2">
                                    <div>
                                        <div className="flex gap-2">
                                            <div className="grid w-full gap-2">
                                                <Label htmlFor="period">
                                                    Periodo Inicio
                                                </Label>

                                                <Input
                                                    name="beginDate"
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    defaultValue={
                                                        filters?.beginDate
                                                    }
                                                />
                                            </div>
                                            <div className="grid w-full gap-2">
                                                <Label htmlFor="period">
                                                    Periodo Fim
                                                </Label>

                                                <Input
                                                    name="endDate"
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    defaultValue={
                                                        filters?.endDate
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <InputError
                                            className="mt-2"
                                            message={errors.beginDate}
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.endDate}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="categories"
                                        className="mb-1"
                                    >
                                        Categoria
                                    </Label>

                                    <MultiSelect
                                        options={categories.map((category) => ({
                                            label: category.name,
                                            value: category.id,
                                        }))}
                                        value={filters?.categories ?? []}
                                        name="categories"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tags" className="mb-1">
                                        Tags
                                    </Label>

                                    <MultiSelect
                                        options={tags.map((tag) => ({
                                            label: tag.name,
                                            value: tag.id,
                                        }))}
                                        value={filters?.categories ?? []}
                                        name="tags"
                                        render={(item) => (
                                            <Badge
                                                style={{
                                                    backgroundColor: tags.find(
                                                        (tag) =>
                                                            tag.id ===
                                                            item.value,
                                                    )?.color,
                                                    color: getContrastColor(
                                                        tags.find(
                                                            (tag) =>
                                                                tag.id ===
                                                                item.value,
                                                        )?.color ?? '#000000',
                                                    ),
                                                }}
                                            >
                                                {item.label}
                                            </Badge>
                                        )}
                                    />
                                </div>
                                <div className="flex items-center justify-end gap-4">
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
    );
}
