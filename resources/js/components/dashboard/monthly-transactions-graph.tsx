import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Bar, BarChart, CartesianGrid, Line, XAxis, YAxis} from "recharts";
import {formatCurrency} from "@/helpers/format";
import {usePage} from "@inertiajs/react";
import {DashboardFilter} from "@/types/dashboard-filter";
import {CategoryType} from "@/types/category-type";

interface TransactionLineGraphDTO {
    month: number;
    total: number
}

const chartConfig = {};
export function MonthlyTransactionsGraph() {
    const {
        transactionByMonth,
    } = usePage<{ transactionByMonth: TransactionLineGraphDTO[] }>().props;

    function getGraphColor(type: CategoryType){
        switch (type){
            case 'EXPENSE':
                return '#FF6467';
            case 'REVENUE':
                return '#05DF72';
        }
    }

    function getTypeLabel(type?: string){
        if(!type) return "-";
        switch (type.toUpperCase()){
            case 'EXPENSE':
                return 'Despesas';
            case 'REVENUE':
                return 'Receitas';
        }
    }

    return (
        <Card className="p-4">
            <CardHeader className="flex flex-col items-stretch border-b sm:flex-row">
                <CardTitle>Receitas X Depesas</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
                <ChartContainer config={chartConfig} className="aspect-auto h-62.5 w-full">
                    <BarChart accessibilityLayer data={transactionByMonth} margin={{left: 12, right: 12}}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                return new Date(2026, Number(value) - 1, 1).toLocaleDateString("pt-BR", {
                                    month: "short",
                                })
                            }}
                        />
                        <Bar dataKey="expense" fill={getGraphColor('EXPENSE')} radius={4} />
                        <Bar dataKey="revenue" fill={getGraphColor('REVENUE')} radius={4} />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator={"dashed"}
                                    labelFormatter={(_, payload) => {
                                        const month = payload?.[0]?.payload?.month;
                                        if(!month) return '';

                                        return new Date(2026, Number(month) - 1, 1).toLocaleDateString("pt-BR", {
                                            month: "long",
                                        })
                                    }}
                                    formatter={(value, name, item) => (
                                        <div className="flex w-full items-center justify-between gap-4">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span>{getTypeLabel(name as string)}</span>
                                            </div>
                                            <span className="font-mono font-medium">
                                                {formatCurrency(Number(value))}
                                            </span>
                                        </div>
                                    )}
                                />
                            }
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
