const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
  const {username, password} = req.body;

  if(!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if(users[username]){
    return res.status(409).json({message: "Username already exists"});
  }

  users[username] = {password};
  res.status(201).json({message: "User successsfully registered"});

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
  
    const booksData = books;

    res.json(booksData);

  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

     try {
    const isbn = req.params.isbn;

    const book = books[isbn];

    if(book) {
      res.json(book);
    }else {
      res.status(404).json({message: "Book not found"});
    }

  }catch(error){
    res.status(500).json({message: 'Error fetching books'});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  const authorName = req.params.author.toLowerCase();

  const bookList = Object.values(books);

  const booksByAuthor = bookList.filter(book => book.author.toLowerCase() === authorName);

  if(booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  }else {
    res.status(404).json({message: "Books by this author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const titleName = req.params.title.toLowerCase();

    const bookList = Object.values(books);

    const booksByTitle = bookList.filter(book => book.title.toLowerCase() === titleName);

    if(booksByTitle.length > 0){
      res.json(booksByTitle);
    }else {
      res.status(404).json({message: "Book with this title not found"});
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    const isbn = req.params.isbn;

    const book = books[isbn];

    if(book) {
      res.json(book.reviews);
    }else {
      res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
