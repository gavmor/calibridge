import { test, expect, equals, is } from "@benchristel/taste";
import { Book } from "./Book";

export type Fetcher = (url: string) => Promise<Response>;

export async function identifyMissing(goodreads: Book[], calibre: URL, fetcher: Fetcher = fetch) {
    const results = await Promise.all(goodreads.map(hasBook(fetcher, calibre)));
    return results.filter(isBook);
}

test(identifyMissing.name, {
    async "works on empty arrays"() {
        expect(await identifyMissing([], new URL("http://example.com")), equals, []);
    },
    async "filters out books found at the provided url"() {
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
});

export const isBook = (book: Book | null) => book !== null;

export const hasBook = (fetcher: Fetcher, calibre: URL): (Book) => Promise<Book | null> =>
    async (book) => {
        const response = await fetcher(`${calibre}/search?q=${book.isbn}`);
        const atomData = await response.text();
        return !atomData.includes(book.isbn) ? book : null;
    };

export async function identifyAvailable(candidates: Book[], datasette: URL, fetcher: Fetcher = fetch) {
    return candidates
}

test(identifyAvailable.name, {
    async "when none provided, returns empty array"() {
        expect(await identifyAvailable([], new URL("http://example.com")), equals, [])
    },
    async "when some provided, returns them"() {
        const book = { title: "foo", author: "bar", isbn: "baz" };
        expect(await identifyAvailable([book], new URL("http://example.com")), equals, [book])
    }
})
