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


  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
