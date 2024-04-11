import { Database } from "bun:sqlite";
import Mustache from "mustache";
import type { Book } from "./types";

export default async function (
  db: Database,
  id: string,
  cookieExists: boolean,
) {
  const head = await Bun.file("templates/head.mustache").text();
  const body = await Bun.file("templates/book.mustache").text();
  const footer = await Bun.file("templates/footer.mustache").text();
  const book = db
    .query<Book, string>("SELECT * FROM books WHERE id=?1")
    .get(id);

  if (book) {
    /* book.available = book.available === "FALSE" ?
            '<small class="danger">Sold Out</small>' :
            `<button type="button" id="add-book" onclick="handleCart(${id})">Add to Cart</button>`; */

    if (book.available === "FALSE") {
      book.available = '<small class="danger">Sold Out</small>';
    } else if (cookieExists) {
      book.available = `
<button type="button"
id="add-book"
onclick="handleCart(${id})"
disabled="true"
>Add to Cart</button>
<p id="book-added">Added to card</p>
`;
    } else {
      book.available = `
<button type="button"
id="add-book"
onclick="handleCart(${id})"
>Add to Cart</button>
<p id="book-added"></p>
`;
    }
  } else {
    return "404";
  }

  const view = {
    head: head,
    book: book,
    footer: footer,
  };

  const html = Mustache.render(body, view);

  return html;
}
