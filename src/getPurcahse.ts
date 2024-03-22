import { Database } from "bun:sqlite";
import Mustache from 'mustache';
import type { Book, CheckoutBody } from "./types";

export default async function(db: Database, ids: string[], formBody: CheckoutBody) {
    const head = await Bun.file("templates/head.mustache").text();
    const body = await Bun.file("templates/purcahse.mustache").text();
    const footer = await Bun.file("templates/footer.mustache").text();

    let books: Book[] = [];
    console.log(ids);
    for (const id of ids) {
        const book = db.query<Book, string>("SELECT * FROM books WHERE id=?;").get(id);
        if (!book) return {
            html: "error 502",
            success: false,
        }

        if (book.available === "FALSE") return {
            html: "error 502",
            success: false,
        }

        books.push(book);
    }

    const view = {
        head: head,
        first: formBody.firstName,
        last: formBody.lastName,
        email: formBody.email,
        books: books,
        footer: footer,
    }

    const html = Mustache.render(body, view);

    const result = {
        html: html,
        success: true,
    }

    return result;
}
