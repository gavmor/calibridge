import { expect, is, test } from "@benchristel/taste";
import { Book } from "./Book";

export function writeBookCSV(candidates: Book[], file: string, { writeFileSync } = require('fs')) {
    const csv = "title,author,isbn\n"
        + candidates.map(book => `${book.title},${book.author},${book.isbn}`).join("\n");
    writeFileSync(file, csv);
}

test(writeBookCSV.name, {
    "writes difference to file"() {
        writeBookCSV(
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

type FileSystem = {
    readFileSync: (path: string) => string;
} | {
    writeFileSync: (path: string, data: string) => void;
}

