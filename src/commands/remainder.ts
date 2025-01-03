import { equals, expect, is, test } from "@benchristel/taste";
import { parse as parseCSV } from 'csv-parse/sync';
import { writeBookCSV } from "../util/writeBookCSV";
import { identifyMissing } from "../util/identifyMissing";
import type { Command } from "commander";
import { hydrateRows } from "./hydrateRows";

export async function remainder({ goodreads, calibre, output }, _: Command) {
    const candidates = !calibre
        ? readGoodreads(goodreads)
        : await identifyMissing(readGoodreads(goodreads), calibre)

    writeBookCSV(candidates, output)
}

function readGoodreads(path: string, { readFileSync } = require('fs')) {
    const rows = parseCSV(readFileSync(path, 'utf-8'), {
        columns: true,
        skip_empty_lines: true
    });

    return hydrateRows(rows);
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




