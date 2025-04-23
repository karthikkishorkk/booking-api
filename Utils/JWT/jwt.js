const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";

const generateToken = (id, type) => {
  return jwt.sign({ id, type }, JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id;
    req.userType = decoded.type;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { generateToken, verifyToken };
