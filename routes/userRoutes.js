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
      res.json({ message: "Login successful", token });
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
  
  

module.exports = router;
