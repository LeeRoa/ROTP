// utils/search.ts
export function buildSearchParamsUtil(
    field: string,
    keyword: string,
    searchableFields: string[]
): { fields: string[]; keyword: string } | undefined {
    if (!keyword.trim()) return undefined;

    if (field === "ALL" || field === "all") {
        return {
            fields: searchableFields,
            keyword: keyword.trim(),
        };
    }

    return {
        fields: [field],
        keyword: keyword.trim(),
    };
}