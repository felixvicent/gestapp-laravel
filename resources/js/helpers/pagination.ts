import { PaginatedDataLink } from '@/types/pagination';

export function generatePagination(
    links: PaginatedDataLink[],
    delta = 1,
): PaginatedDataLink[] {
    const pages = links.slice(1, -1);

    const firstPage = pages[0].page!;
    const lastPage = pages[pages.length - 1].page!;
    const currentPage = pages.find((link) => link.active)?.page ?? 1;

    const visiblePages = new Set<number>([firstPage, lastPage]);

    for (
        let page = Math.max(firstPage, currentPage - delta);
        page <= Math.min(lastPage, currentPage + delta);
        page++
    ) {
        visiblePages.add(page);
    }

    const result: PaginatedDataLink[] = [];
    let previousPage: number | null = null;

    pages.forEach((link) => {
        if (!visiblePages.has(link.page!)) return;

        if (previousPage !== null && link.page! - previousPage > 1) {
            result.push({
                url: null,
                label: '...',
                page: null,
                active: false,
                ellipsis: true,
            });
        }

        result.push(link);
        previousPage = link.page;
    });

    return result;
}
