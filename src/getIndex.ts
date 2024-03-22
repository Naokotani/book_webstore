import Mustache from 'mustache';
import { Database } from "bun:sqlite";
import type { Book } from './types';

export default async function getIndex(db: Database) {
    const head = await Bun.file("templates/head.mustache").text();
    const body = await Bun.file("templates/index.mustache").text();
    const footer = await Bun.file("templates/footer.mustache").text();

    const q = db.query<Book, null>(`SELECT * FROM books;`)
    const books = q.all(null)

    books.forEach(book => {
        book.available = book.available === "TRUE" ?
            '<small class="available"></small>' :
            '<small class="danger">Sold Out</small>'
    })

    const view = {
        head: head,
        books: books,
        footer: footer,
    }
    const html = Mustache.render(body, view);

    return html;
}
