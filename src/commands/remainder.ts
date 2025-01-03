import { equals, expect, is, test } from "@benchristel/taste";
import { parse as parseCSV } from 'csv-parse/sync';
import { writeBookCSV } from "../util/writeBookCSV";
import type { Command } from "commander";
import { program } from "../program";

type RemainderOptions = {
    goodreads: string;
    calibre?: URL;
    output: string;
    verbose: boolean;
};

export type Book = {
    title: string;
    author: string;
    isbn: string;
    downloadURL?: string;
};

export async function remainder({ goodreads, calibre, output }, _: Command) {
    const candidates = !calibre
        ? readGoodreads(goodreads)
        : await identifyMissing(readGoodreads(goodreads), calibre)

    writeBookCSV(candidates, output)
}

interface FileReader {
    readFileSync: (path: string, encoding: string) => string
}


async function identifyMissing(goodreads: Book[], calibre: URL, fetcher: Fetcher = fetch) {
    const results = await Promise.all(goodreads.map(hasBook(fetcher, calibre)));
    return results.filter(isBook);
}

type Fetcher = (url: string) => Promise<Response>;

test("identifyMissing", {
    async "works on empty arrays"() {
        expect(await identifyMissing([], new URL("http://example.com")), equals, []);
    },
    async "finds difference between two arrays"() {
        const bookEntryFixture = `<entry><title>Book 2</title><author>Author 2</author><isbn>0987654321</isbn></entry>`;
        const mockFetch = async (url: string) => ({
            async text() { return bookEntryFixture; }
        }) as Response;

        expect(await identifyMissing(
            [
                { title: "Book 1", author: "Author 1", isbn: "1234567890" },
                { title: "Book 2", author: "Author 2", isbn: "0987654321" },
            ],
            new URL("http://example.com"),
            mockFetch
        ), equals, [
            { title: "Book 1", author: "Author 1", isbn: "1234567890" },
        ]);
    }
})


function readGoodreads(file: string, reader: FileReader = require('fs')) {
    const records = parseCSV(reader.readFileSync(file, 'utf-8'), {
        columns: true,
        skip_empty_lines: true
    });

    return records.map(record => ({
        title: record['Title'],
        author: record['Author'],
        isbn: record['ISBN']
    }));
}


test(readGoodreads.name, {
    "produces an array of books"() {
        const goodreadsExportFixture = `Title,Author,ISBN\nBook 1,Author 1,1234567890\nBook 2,Author 2,0987654321`;
        const goodreads = readGoodreads("goodreads.csv", {
            readFileSync() { return goodreadsExportFixture }
        });
        expect(goodreads, equals, [
            { title: "Book 1", author: "Author 1", isbn: "1234567890" },
            { title: "Book 2", author: "Author 2", isbn: "0987654321" },
        ]);
    },
});


const isBook = (book: Book | null) => book !== null;

const hasBook = (fetcher: Fetcher, calibre: URL):
    (Book) => Promise<Book | null> =>
    async (book) => {
        const response = await fetcher(`${calibre}/search?q=${book.isbn}`);
        const atomData = await response.text();
        return !atomData.includes(book.isbn) ? book : null;
    };
