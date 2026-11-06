import {Category} from "@/types/category";

export interface Transaction {
    id: number;
    title: string;
    description: string | null;
    value: number;
    date: Date;
    category: Category;
    created_at: string;
    updated_at: string;
}
