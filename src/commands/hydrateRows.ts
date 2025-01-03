import { Book } from "../util/Book";

export const hydrateRows = (records: any[]): Book[] => records.map(record => ({
    title: record['Title'] || record['Title'],
    author: record['Author'],
    isbn: record['ISBN']
}));

