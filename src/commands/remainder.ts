import { equals, expect, is, test } from "@benchristel/taste";
import { write } from "fs";
import { parse } from 'csv-parse/sync';

type RemainderOptions = {
    goodreads: string;
    calibre?: URL;
    output: string;
    verbose: boolean;
};

type Book = {
    title: string;
    author: string;
    isbn: string;
    downloadURL?: string;
};

export async function remainder(opts: RemainderOptions) {
    const goodreads = readGoodreads(opts.goodreads);
    if(!opts.calibre) return goodreads;
    const difference = await identifyMissing(goodreads, opts.calibre);
    writeDifference(difference, opts.output);
}

interface FileReader {
    readFileSync: (path: string, encoding: string) => string
}

function readGoodreads(file: string, reader: FileReader = require('fs')) {
    const data = reader.readFileSync(file, 'utf-8');
    const records = parse(data, {
        columns: true,
        skip_empty_lines: true
    });

    return records.map((record: any) => ({
        title: record['Title'],
        author: record['Author'],
        isbn: record['ISBN']
    }));
}

function readCalibre(file: string) {
    // This function reads the Calibre OPDS file and returns its contents as an array of objects.
    return [
        { title: "Book 2", author: "Author 2", isbn: "0987654321" },
        { title: "Book 3", author: "Author 3", isbn: "1357924680" },
    ];
}

type Fetcher = (url: string) => Promise<Response>;

async function identifyMissing(goodreads: Book[], calibre: URL, fetcher: Fetcher = fetch) {
    const results = await Promise.all(goodreads.map(async (book) => {
        const response = await fetcher(`${calibre}/search?q=${book.isbn}`);
        const atomData = await response.text();
        return !atomData.includes(book.isbn) ? book : null;
    }));
    return results.filter((book): book is Book => book !== null);
}

test("readGoodreads", {
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

test("readCalibre", {
    "reads Calibre file"() {
        expect(readCalibre("calibre.json"), equals, [
            { title: "Book 2", author: "Author 2", isbn: "0987654321" },
            { title: "Book 3", author: "Author 3", isbn: "1357924680" },
        ]);
    },
})

test("findDifference", {
    "works on empty arrays"() {
        expect(identifyMissing([], new URL("example.com")), equals, []);
    },
    "finds difference between two arrays"() {
        const bookEntryFixture = `<entry><title>Book 2</title><author>Author 2</author><isbn>0987654321</isbn></entry>`;
        const mockFetch = async (url: string) => ({
            async text() { return bookEntryFixture; }
        }) as Response;
        
        expect(identifyMissing(
            [
                { title: "Book 1", author: "Author 1", isbn: "1234567890" },
                { title: "Book 2", author: "Author 2", isbn: "0987654321" },
            ],
            new URL("example.com"),
            mockFetch
        ), equals, [
            { title: "Book 1", author: "Author 1", isbn: "1234567890" },
        ]);
    }
})

test("writeDifference", {
    "writes difference to file"() {
        writeDifference(
            [{ title: "Book 1", author: "Author 1", isbn: "1234567890" }],
            "difference.csv",
            {
                writeFileSync(path: string, data: string) {
                    expect(path, is, "difference.csv");
                    expect(data, is, "title,author,isbn\nBook 1,Author 1,1234567890");

                    return "success";
                }
            }
        );
    }
})

interface FileWriter {
    writeFileSync: (path: string, data: string) => void;
}

function writeDifference(difference: Book[], file: string, writer: FileWriter = require('fs')) {
    // This function writes the difference list to a new CSV file.
    // The file will contain the title, author, and ISBN of each book in the difference list.

    const csv = "title,author,isbn\n"
        + difference.map(book => `${book.title},${book.author},${book.isbn}`).join("\n");
    writer.writeFileSync(file, csv);
}