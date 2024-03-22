export type BookCsv = {
    BookID: string,
    Title: string,
    Author: string,
    Genre: string,
    Price: string,
    ImageFileName: string,
    Available: string
}

export type Book = {
    id: string,
    title: string,
    author: string,
    genre: string,
    price: string,
    image: string,
    available: string,
}

export type CheckoutBody = {
    firstName: string,
    lastName: string,
    email: string,
}
