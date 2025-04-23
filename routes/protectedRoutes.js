const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Utils/JWT/jwt");

// Protected route to check if token is valid
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "✅ You are authenticated!",
    userId: req.user,
    userType: req.userType,
  });
});

module.exports = router;
