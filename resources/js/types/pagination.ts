export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginatedDataLink[];
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
}

export interface PaginatedDataLink {
    url: string | null;
    label: string;
    active: boolean;
    page: number | null;
    ellipsis: boolean;
}
