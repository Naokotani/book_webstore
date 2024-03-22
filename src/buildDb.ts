import { Database } from "bun:sqlite";
import Papa, { type ParseResult } from 'papaparse';
import type { Book, BookCsv } from './types.ts'

export default async function() {
    const db: Database = new Database(":memory:");

    const csv = await Bun.file("data/booksdata.csv").text();
    const books: ParseResult<BookCsv> = Papa.parse(csv, { header: true });

    db.query(`
CREATE TABLE books (
id integer primary key,
title text,
author text,
genre text,
price real,
image text,
available boolean
);
`).run()

    books.data.forEach(book => {
        if (book.Title) {
            const insert: Book = {
                id: book.BookID,
                title: book.Title,
                author: book.Author,
                genre: book.Genre,
                price: book.Price,
                image: book.ImageFileName,
                available: book.Available,
            }
            db.query(`
INSERT INTO books (title, author, genre, price, image, available)
VALUES ($title, $author, $genre, $price, $image, $available);
`).values({
                $title: insert.title,
                $author: insert.author,
                $genre: insert.genre,
                $price: insert.price,
                $image: insert.image,
                $available: insert.available,
            }
            );
        }
    });

    return db;
}
