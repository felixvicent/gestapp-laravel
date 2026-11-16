import { TransactionByTag as TransactionByTagType } from '@/pages/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';
import { formatCurrency } from '@/helpers/format';
import { getContrastColor } from '@/helpers/color';

interface Props {
    title: string;
    transactions: TransactionByTagType[];
}

export function TransactionByTag({ title, transactions }: Props) {
    return (
        <Card>
            <CardHeader className="items-center border-b pb-0">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}}>
                    <BarChart
                        accessibilityLayer
                        data={transactions}
                        layout="vertical"
                        margin={{ right: 64 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="tag"
                            type="category"
                            tick={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="total" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;

                                const item = payload[0];
                                const tag = item.payload;

                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="size-2.5 rounded-full"
                                                style={{
                                                    backgroundColor: tag.color,
                                                }}
                                            />

                                            <span className="text-sm font-medium">
                                                {tag.tag}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm font-semibold">
                                            {formatCurrency(
                                                Number(item.value ?? 0),
                                            )}
                                        </p>
                                    </div>
                                );
                            }}
                        />
                        <Bar dataKey="total" radius={4}>
                            {transactions.map((item) => (
                                <Cell key={item.tag} fill={item.color} />
                            ))}
                            <LabelList
                                dataKey="tag"
                                content={(props) => {
                                    const {
                                        width = 0,
                                        height = 0,
                                        x = 0,
                                        y = 0,
                                        value,
                                    } = props;

                                    if (Number(width) < 80) return null;

                                    return (
                                        <text
                                            x={Number(x) + 8}
                                            y={Number(y) + Number(height) / 2}
                                            fill={getContrastColor(
                                                props?.fill ?? '#000000',
                                            )}
                                            fontSize={12}
                                            dominantBaseline="middle"
                                        >
                                            {value}
                                        </text>
                                    );
                                }}
                            />
                            <LabelList
                                dataKey="total"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(value) =>
                                    formatCurrency(Number(value ?? 0))
                                }
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
