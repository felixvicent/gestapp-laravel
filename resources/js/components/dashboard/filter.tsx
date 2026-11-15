import React, {useState} from "react";
import {Form, router, usePage} from "@inertiajs/react";
import {DashboardFilter as DashboardFilterType} from "@/types/dashboard-filter";
import {index} from "@/actions/App/Http/Controllers/DashboardController";
import {Filter} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import InputError from "@/components/input-error";

export function DashboardFilter() {
    const {filters} = usePage<{ filters: DashboardFilterType }>().props

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" type="button"><Filter/></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <Form
                    action={index().url}
                      method="GET"
                      options={{
                          preserveState: true,
                          preserveScroll: true,
                          replace: true,
                      }}
                      className="space-y-6"
                      onSuccess={() => setIsOpen(false)}
                >
                    {({processing, errors}) => (
                        <>
                            <div className="w-full">
                                <div>
                                    <div className="flex gap-2">
                                        <div className="grid gap-2 w-full">
                                            <Label htmlFor="period">Periodo Inicio</Label>

                                            <Input
                                                name="beginDate"
                                                type="date"
                                                className="mt-1 block w-full"
                                                defaultValue={filters?.beginDate}
                                            />


                                        </div>
                                        <div className="grid gap-2 w-full">
                                            <Label htmlFor="period">Periodo Fim</Label>

                                            <Input
                                                name="endDate"
                                                type="date"
                                                className="mt-1 block w-full"
                                                defaultValue={filters?.endDate}
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
                            <div className="flex items-center gap-4 justify-end mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
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
            </DialogContent>
        </Dialog>

    )
}
