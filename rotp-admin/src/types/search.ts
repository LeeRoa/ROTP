export const AdminAccountSearchableFields = ["username", "email", "nickname"];

export interface SearchParams {
    fields: string[];
    keyword: string;
}