import {
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {PaginatedDataLink} from "@/types/pagination";
import {generatePagination} from "@/helpers/pagination";

interface Props {
    prevPageUrl: string | null,
    nextPageUrl: string | null
    links: PaginatedDataLink[],
    lastPage: number;
}
export function Pagination({ prevPageUrl, links, nextPageUrl, lastPage }: Props){
    if(lastPage <= 1) return ;
    return (
        <PaginationContent>
            {prevPageUrl && <PaginationItem><PaginationPrevious href={prevPageUrl}/></PaginationItem>}
            {generatePagination(links).map(link => (
                <PaginationItem key={link.label}>
                    <PaginationLink isActive={link.active} href={link.url ?? '#'}>
                        {link.label}
                    </PaginationLink>
                </PaginationItem>
            ))}
            {nextPageUrl && <PaginationItem><PaginationNext href={nextPageUrl} /></PaginationItem>}
        </PaginationContent>
    )
}
