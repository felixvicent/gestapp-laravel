import {
    Table as TableShadcn,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PaginatedData } from '@/types/pagination';
import { ReactNode } from 'react';
import { Pagination } from '@/components/pagination';
import { Empty, EmptyProps } from '@/components/_general/empty';

export interface ColumnProps<T> {
    title?: string;
    class?: string;
    key?: keyof T;
    render?: (item: T) => ReactNode;
}

interface Props<T> {
    columns: ColumnProps<T>[];
    data: PaginatedData<T>;
    emptyProps?: EmptyProps;
}

export function Table<T>({ columns, data, emptyProps }: Props<T>) {
    if (data.data.length === 0) return <Empty {...emptyProps} />;
    return (
        <>
            <TableShadcn className="overflow-hidden rounded-lg">
                <TableHeader className="sticky top-0 z-10 bg-muted">
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={String(column.key)}
                                className={column.class}
                            >
                                {column.title}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.data.map((item, index) => (
                        <TableRow key={index}>
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.key)}
                                    className={column.class}
                                >
                                    {column.render
                                        ? column.render(item)
                                        : column.key &&
                                          String(item[column.key] ?? '-')}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </TableShadcn>
            <div className="flex items-center justify-end">
                <Pagination
                    links={data.links}
                    prevPageUrl={data.prev_page_url}
                    nextPageUrl={data.next_page_url}
                    lastPage={data.last_page}
                />
            </div>
        </>
    );
}
