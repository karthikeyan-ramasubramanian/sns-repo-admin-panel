const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies['x-access-token'];
    console.log("token"+token)
  if (!token) {
    return res.status(200).redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(200).redirect('/login');
  }
  return next();
};

module.exports = verifyToken;