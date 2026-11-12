import {Select} from "@/components/_general/select";
import React from "react";
import {router, usePage} from "@inertiajs/react";
import {DashboardFilter as DashboardFilterType} from "@/types/dashboard-filter";
import {SelectOptions} from "@/types/select-options";
import {index} from "@/actions/App/Http/Controllers/DashboardController";

export function DashboardFilter() {
    const { period, filters } = usePage<{ period: SelectOptions[], filters: DashboardFilterType }>().props


    function handlePeriodChange(period: string) {
        router.get(
            index().url,
            {
                ...filters,
                period,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    return (
        <div className="grid gap-2">
            <Select
                name="period"
                placeholder="Nome da transação"
                options={period}
                value={filters?.period ?? 'CURRENT_MONTH'}
                onChange={(value) => handlePeriodChange(value)}
            />
        </div>
    )
}
