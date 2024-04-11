import { Database } from "bun:sqlite";
import Mustache from "mustache";
import type { Book, BookAdmin } from "./types";

export default async function (db: Database) {
  const head = await Bun.file("templates/head.mustache").text();
  const body = await Bun.file("templates/admin.mustache").text();
  const footer = await Bun.file("templates/footer.mustache").text();
  const data = db.query<Book, null>("SELECT * FROM books").all(null);

  const books: BookAdmin[] = [];
  if (data) {
    data.forEach((book) => {
      const bookObj: BookAdmin = {
        id: book.id,
        title: book.title,
        available: book.available,
        isTrue: "",
        isFalse: "",
      };
      if (book.available === "TRUE") {
        bookObj.available = "Available";
        bookObj.isTrue = "selected";
      } else {
        bookObj.available = "Sold Out";
        bookObj.isFalse = "selected";
      }
      books.push(bookObj);
    });
  }

  const view = {
    head: head,
    books: books,
    footer: footer,
  };

  const html = Mustache.render(body, view);

  return html;
}
