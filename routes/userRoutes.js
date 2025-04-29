const express = require("express");
const router = express.Router();
const { generateToken } = require("../Utils/JWT/jwt");
const User = require('../models/Users');
const bcrypt = require('bcryptjs');


// Real login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Compare the plain password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = generateToken(user._id, "user");
      res.json({ message: "Login successful", token, role:"user" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Signup route
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
  
      // Hash the password using bcryptjs
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({ username, email, password: hashedPassword });
  
      res.status(201).json({ message: "Signup successful" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
// DELETE User (Staff) by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// PUT/UPDATE User (Staff) by ID
router.put('/:id', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Optionally hash the password if it's being updated
    let updatedData = { username, email };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: 'User updated successfully', updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords for security
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});


// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});


module.exports = router;
