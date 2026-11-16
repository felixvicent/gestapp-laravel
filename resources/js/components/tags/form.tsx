import { Form } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Tag } from '@/types/tag';
import { store, update } from '@/routes/tags';

interface Props {
    onCancel: () => void;
    tag?: Tag | null;
}

export function TagForm({ onCancel, tag }: Props) {
    const isEditing = tag != null;

    return (
        <Form
            {...(isEditing ? update.form(tag.id) : store.form())}
            className="space-y-6"
            options={{
                preserveScroll: true,
            }}
            onSuccess={() => onCancel()}
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>

                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            name="name"
                            required
                            placeholder="Nome da tag"
                            defaultValue={tag?.name ?? ''}
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="color">Cor</Label>

                        <Input
                            id="color"
                            className="mt-1 block w-full"
                            name="color"
                            required
                            placeholder="color da tag"
                            defaultValue={tag?.color ?? ''}
                            type="color"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => onCancel()}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button disabled={processing} type="submit">
                            {isEditing ? 'Atualizar' : 'Criar'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
