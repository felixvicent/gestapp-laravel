import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {MonthlyTransactionsGraph} from "@/components/dashboard/monthly-transactions-graph";
import {TransactionCard} from "@/components/dashboard/transaction-card";
import {DashboardFilter} from "@/components/dashboard/filter";
import {TransactionByCategory} from "@/components/dashboard/transaction-by-category";

export interface TransactionVariation {
    currentTotal: number;
    previousTotal: number;
    variation?: number;
}

export interface TransactionByCategory {
    total: number;
    category: string
}

interface Props {
    expenseVariation: TransactionVariation;
    revenueVariation: TransactionVariation;
    expenseByCategory: TransactionByCategory[];
    revenueByCategory: TransactionByCategory[];
}

export default function Dashboard({
    expenseVariation,
    revenueVariation,
    expenseByCategory,
    revenueByCategory
}: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <DashboardFilter />
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <TransactionCard title="Receitas do período" variation={revenueVariation} type="REVENUE" />
                    <TransactionCard title="Despesas do período" variation={expenseVariation} type="EXPENSE" />
                </div>
                <MonthlyTransactionsGraph />

                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <TransactionByCategory transactions={revenueByCategory} title="Receitas por categoria" />
                    <TransactionByCategory transactions={expenseByCategory} title="Despesas por categoria" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
