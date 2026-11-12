import {Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {formatCurrency} from "@/helpers/format";
import {Badge} from "@/components/ui/badge";
import {TransactionVariation} from "@/pages/dashboard";
import {CategoryType} from "@/types/category-type";
import {cn} from "@/lib/utils";

interface Props {
    title: string;
    variation: TransactionVariation;
    type: CategoryType
}

export function TransactionCard({title, variation, type}: Props) {
    const increased = variation.variation != null && variation.variation > 0;
    const isGood = type === 'EXPENSE' ? !increased : increased;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl font-semibold  tabular-nums @[250px]/card:text-3xl">
                    {formatCurrency(variation.currentTotal, false)}
                </CardTitle>
                <CardAction>
                    <Badge variant="outline">
                        {variation.variation ? (
                            <span className={cn("text-lg", isGood ? "text-green-400" : "text-red-400")}>
                                {`${increased ? '+' : ''}${variation.variation?.toFixed(1)}%`}
                            </span>
                        ) : "-"}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {formatCurrency(variation.previousTotal, false)}
                </div>
                <div className="text-muted-foreground">No período anterior</div>
            </CardFooter>
        </Card>
    )

}
