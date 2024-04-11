import express from "express";
import { Database } from "bun:sqlite";
import cookieParser from "cookie-parser";

import getIndex from "./src/getIndex";
import buildDb from "./src/buildDb";
import getBook from "./src/getBook.ts";
import getCheckout from "./src/getCheckout.ts";
import getPurcahse from "./src/getPurcahse.ts";
import getAdmin from "./src/getAdmin.ts";
import updateAvailability from "./src/updateAbvailability.ts";

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json());

const db: Database = await buildDb();

app.use("/", express.static("static"));

app.get("/", async (req, res) => {
  const html = await getIndex(db);
  if (!req.cookies["j:cart"]) {
    res.cookie("j:cart", { books: [] }, { sameSite: true });
  }

  res.set("Content-Type", "text/html");
  res.send(html);
});

app.get("/books/:book", async (req, res) => {
  let cookieExists = false;
  if (!req.cookies) {
    res.cookie("j:cart", { books: [] }, { sameSite: true });
  } else {
    cookieExists = req.cookies["j:cart"].books.includes(req.params.book);
  }

  if (req.params.book.match(/^[0-9]+$/)) {
    const book = await getBook(db, req.params.book, cookieExists);
    res.send(book);
  } else {
    res.send("error");
  }
});

app.get("/checkout", async (req, res) => {
  const ids = req.cookies["j:cart"];
  const html = await getCheckout(db, ids.books);
  res.send(html);
});

app.post("/checkout", async (req, res) => {
  const ids = req.cookies["j:cart"];
  const purcahse = await getPurcahse(db, ids.books, req.body);
  if (purcahse.success) {
    res.cookie("j:cart", { books: [] }, { sameSite: true });
  }
  res.send(purcahse.html);
});

app.post("/cart/:id", (req, res) => {
  const c = req.cookies["j:cart"];
  if (!c.books.includes(req.params.id)) {
    c.books.push(req.params.id);
    res.cookie("j:cart", c, { sameSite: true }).send("item added to cart");
  } else {
    res.status(400);
    res.send("Book already in cart");
  }
});

app.delete("/cart/:id", (req, res) => {
  const c = req.cookies["j:cart"];
  if (c.books.includes(req.params.id)) {
    const index = c.books.indexOf(req.params.id);
    c.books.splice(index, 1);
    res.cookie("j:cart", c, { sameSite: true }).send("item removed to cart");
  } else {
    res.status(400);
    res.send("Book not in cart");
  }
});

app.get("/admin", async (_, res) => {
  const html = await getAdmin(db);
  res.send(html);
});

app.post("/admin", async (req, res) => {
  const result = updateAvailability(db, req.body);
  if (result) {
    res.send("Success");
  } else {
    res.status(500);
    res.send("Error updating availability");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
