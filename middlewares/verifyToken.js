const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
  if (authHeader) {
    // const token = authHeader.split(" ")[1];
    jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(401).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

module.exports = {verifyToken}