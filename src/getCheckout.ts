import { Database } from "bun:sqlite";
import Mustache from 'mustache';
import type { Book } from "./types";

export default async function(db: Database, ids: string[]) {
    const head = await Bun.file("templates/head.mustache").text();
    const body = await Bun.file("templates/checkout.mustache").text();
    const footer = await Bun.file("templates/footer.mustache").text();

    let books: Book[] = [];
    for (const id of ids) {
        const book = db.query<Book, string>("SELECT * FROM books WHERE id=?;").get(id);
        if (!book) return "error 502";
        if (book.available === "FALSE") return "error 502";

        books.push(book);
    }

    const view = {
        head: head,
        books: books,
        footer: footer,
    }

    const html = Mustache.render(body, view);

    return html;
}
