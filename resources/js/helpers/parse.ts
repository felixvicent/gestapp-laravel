import { SelectOptions } from '@/types/select-options';

export function parseCategoryType(
    types: SelectOptions[],
    categoryType: string,
) {
    return types.find((type) => type.value === categoryType)?.label;
}
