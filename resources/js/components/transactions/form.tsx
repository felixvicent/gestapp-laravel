import { Form, usePage } from '@inertiajs/react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/TransactionController';
import { Category } from '@/types/category';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import React, {useState} from 'react';
import { Transaction } from '@/types/transaction';
import { Select } from '@/components/_general/select';
import { MultiSelect } from '@/components/_general/multi-select';
import { Tag } from '@/types/tag';
import { Badge } from '@/components/ui/badge';
import { getContrastColor } from '@/helpers/color';
import {Checkbox} from "@/components/ui/checkbox";

interface Props {
    transaction?: Transaction | null;
    onCancel: () => void;
}
export function TransactionForm({ transaction, onCancel }: Props) {
    const [isInstallments, setIsInstallments] = useState(false);

    const isEditing = transaction != null;

    const { categories, tags } = usePage<{
        categories: Category[];
        tags: Tag[];
    }>().props;

    return (
        <Form
            {...(isEditing ? update.form(transaction.id) : store.form())}
            options={{
                preserveScroll: true,
            }}
            className="space-y-6"
            onSuccess={() => onCancel()}
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Título</Label>

                        <Input
                            id="title"
                            className="mt-1 block w-full"
                            name="title"
                            required
                            placeholder="Título da transação"
                            defaultValue={transaction?.title ?? ''}
                        />

                        <InputError className="mt-2" message={errors.title} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>

                        <Textarea
                            id="description"
                            className="mt-1 block w-full"
                            name="description"
                            placeholder="Descrição da transação"
                            defaultValue={transaction?.description ?? ''}
                        />
                    </div>

                    {!isEditing && (
                        <div className="gap-2 flex items-center">
                            <Checkbox
                                id="isInstallments"
                                onCheckedChange={() => setIsInstallments(!isInstallments)}
                                checked={isInstallments}
                            />
                            <Label htmlFor="isInstallments">Parcelado</Label>
                        </div>
                    )}

                    {isInstallments && (
                        <div className="grid gap-2">
                            <Label htmlFor="installments">Parcelas</Label>
                            <Input
                                id="value"
                                className="mt-1 block w-full"
                                name="installments"
                                required
                                type="number"
                                placeholder="Quantidade de parcelas"
                                defaultValue={isEditing ? '' : 1}
                                step="1"
                            />

                            <InputError className="mt-2" message={errors.value} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="value">Valor</Label>
                        <Input
                            id="value"
                            className="mt-1 block w-full"
                            name="value"
                            required
                            type="number"
                            placeholder="Valor da transação"
                            defaultValue={transaction?.value ?? ''}
                            step="0.01"
                        />

                        <InputError className="mt-2" message={errors.value} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Data</Label>
                        <Input
                            id="date"
                            className="mt-1 block w-full"
                            name="date"
                            required
                            type="date"
                            placeholder="Data da transação"
                            defaultValue={transaction?.date.toString() ?? new Date().toISOString().split('T')[0]}
                        />

                        <InputError className="mt-2" message={errors.date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Categoria</Label>

                        <Select
                            name="category_id"
                            value={transaction?.category.id.toString()}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id.toString(),
                            }))}
                        />

                        <InputError
                            className="mt-2"
                            message={errors.category_id}
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
                            value={transaction?.tags.map((tag) => tag.id) ?? []}
                            name="tags"
                            render={(item) => (
                                <Badge
                                    style={{
                                        backgroundColor: tags.find(
                                            (tag) => tag.id === item.value,
                                        )?.color,
                                        color: getContrastColor(
                                            tags.find(
                                                (tag) => tag.id === item.value,
                                            )?.color ?? '#000000',
                                        ),
                                    }}
                                >
                                    {item.label}
                                </Badge>
                            )}
                        />

                        <InputError className="mt-2" message={errors.tags} />
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => onCancel()}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button disabled={processing}>
                            {isEditing ? 'Atualizar' : 'Salvar'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
