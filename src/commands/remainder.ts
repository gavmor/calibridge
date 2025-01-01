import { equals, expect, is, test } from "@benchristel/taste";

type RemainderOptions = {
    goodreads: string;
    calibre?: string;
    output?: string;
    verbose?: boolean;
};

export async function remainder(opts: RemainderOptions) {
    // This function will be called when the "remainder" command is used.
    // It performs a sequence of transformations on the input data:
    // 1. Read the Goodreads CSV file.
    // 2. Read the Calibre OPDS file.
    // 3. Compare the two files and create a difference list.
    // 4. Write the difference list to a new CSV file.
    // 5. Return the list in memory for further processing (ie by the "plan" command).
    // for now, let's just return a dummy list to simulate the process.
    return [
        { title: "Book 1", author: "Author 1", isbn: "1234567890" },
        { title: "Book 2", author: "Author 2", isbn: "0987654321" },
    ];
}

test("remainder command", {
    async "works"() {
        expect(await remainder({
            goodreads: "goodreads.csv",
            calibre: "calibre.json"
        }), equals, [
            { title: "Book 1", author: "Author 1", isbn: "1234567890" },
            { title: "Book 2", author: "Author 2", isbn: "0987654321" },
        ]);
    }
})
