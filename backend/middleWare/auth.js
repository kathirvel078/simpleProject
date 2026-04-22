  const jwt = require("jsonwebtoken");

  const SECRET_KEY = "mysecretkey";

  const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No token" });
    }
    // 🔥 Extract token from "Bearer TOKEN"
    const token = authHeader.split(" ")[1];    //"Bearer eyJhbGciOiJIUzI1NiIs..."


    try {
      const decoded = jwt.verify(token, SECRET_KEY); //token is valid
      req.user = decoded; // attach user info
      next();  
    } catch (err) {
      res.status(403).json({ msg: "Invalid token" });
    }
  };

  module.exports = auth;