import { Category } from '@/types/category';
import { Tag } from '@/types/tag';

export interface Transaction {
    id: number;
    title: string;
    description: string | null;
    value: number;
    date: Date;
    category: Category;
    tags: Tag[];
    created_at: string;
    updated_at: string;
}
