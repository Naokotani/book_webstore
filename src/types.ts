export type BookCsv = {
  BookID: string;
  Title: string;
  Author: string;
  Genre: string;
  Price: string;
  ImageFileName: string;
  Available: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: string;
  image: string;
  available: string;
};

export type CheckoutBody = {
  firstName: string;
  lastName: string;
  email: string;
};

export type BookAdmin = {
  id: string;
  title: string;
  available: string;
  isTrue: string;
  isFalse: string;
};

export type AdminForm = {
  id: string;
  value: string;
};
