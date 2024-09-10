const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const bcrypt = require('bcrypt');
const regd_users = express.Router();

let users = {
  "kasim": { password: bcrypt.hashSync("12345", 10) } // Store hashed passwords
};

const JWT_SECRET = 'myapplication23';

const isValid = (username) => {
  // Check if the username exists in the users object
  return !!users[username];
};

const authenticatedUser = (username, password) => {

  const user = users[username];
  if (!user) return false; 

  return bcrypt.compareSync(password, user.password);
};


regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ username }, "access", { expiresIn: '1h' });

  req.session.authorization = { accessToken: token };

  return res.status(200).json({ message: "Login successful", token });
});


function authenticateToken(req, res, next){
  const token = req.headers['authorization'];
  if(!token) return res.status(401).json({message: 'Access denied'});

  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
    if(err) return res.status(403).json({message: 'Invalid token'});
    req.user = user;
    next();
  });
}


regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; 
  const { review } = req.body;

  console.log(review);

  if (!books[isbn]) { 
    return res.status(404).json({ message: 'Book not found' });
  }

  const username = req.user.username;

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: 'Review was added successfully',
    reviews: books[isbn].reviews
  });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {

  const { isbn } = req.params;

  if(!books[isbn]) {
    return res.status(404).json({message: 'Book not found'});
  }

  const username = req.user.username;

  if(!books[isbn].reviews || !books[isbn].reviews[username]){
    return res.status(404).json({message: 'Review not found'});
  }

  delete books[isbn].reviews[username];

  res.status(200).json({message: 'Review deleted successfully', reviews: books[isbn].reviews});

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
