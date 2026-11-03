import {Form, usePage} from "@inertiajs/react";
import {store, update} from "@/actions/App/Http/Controllers/CategoryController";
import {Category} from "@/types/category";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import InputError from "@/components/input-error";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CategoryType} from "@/types/category-type";

interface Props {
    category?: Category | null,
    onCancel: () => void,
}
export function CategoryForm({category, onCancel}: Props) {
    const isEditing = category != null;

    const { types } = usePage<{ types: CategoryType[] }>().props

    return (
        <Form {...(isEditing ? update.form(category.id) : store.form())}
              options={{
                  preserveScroll: true
              }}
              className="space-y-6"
              onSuccess={() => onCancel()}
        >
            {({processing, errors}) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>

                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            name="name"
                            required
                            placeholder="Nome da categoria"
                            defaultValue={category?.name ?? ''}
                        />

                        <InputError
                            className="mt-2"
                            message={errors.name}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descrição</Label>

                        <Textarea
                            id="description"
                            className="mt-1 block w-full"
                            name="description"
                            placeholder="Descrição da categoria"
                            defaultValue={category?.description ?? ''}
                        />

                        <InputError
                            className="mt-2"
                            message={errors.name}
                        />

                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Tipo</Label>

                        <Select name="type" defaultValue={category?.type}>
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map(type => (
                                    <SelectItem value={type.value}>{type.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <InputError className="mt-2" message={errors.type} />
                    </div>
                    <div className="flex items-center gap-4 justify-end">
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
    )
}
