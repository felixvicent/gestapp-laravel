import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Cell,  Pie, PieChart} from "recharts";
import {formatCurrency} from "@/helpers/format";
import {TransactionByCategory as TransactionByCategoryType} from "@/pages/dashboard";
import {getChartColor} from "@/lib/chart-colors";


interface Props {
    title: string;
    transactions: TransactionByCategoryType[];
}

export function TransactionByCategory({title, transactions}: Props){
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={{}} className="mx-auto aspect-square max-h-62.5">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value, name, item) => {
                                        const total = transactions.reduce(
                                            (sum, category) => sum + Number(category.total),
                                            0
                                        );

                                        const percentage = (Number(value) / total) * 100;

                                        return (
                                            <div className="flex min-w-48 items-center justify-between gap-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="size-2.5 rounded-full"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span>{name}</span>
                                                </div>

                                                <div className="text-right">
                                                    <div className="font-mono font-medium">
                                                        {formatCurrency(Number(value))}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {percentage.toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            }
                        />
                        <Pie
                            data={transactions}
                            dataKey="total"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {transactions.map((item, index) => (
                                <Cell
                                    key={item.category}
                                    fill={getChartColor(index)}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
