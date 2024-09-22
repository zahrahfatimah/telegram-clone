const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRETKEY;

const signToken = (payload) =>
  jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h",
  });
const verifyToken = (token) => jwt.verify(token, SECRET_KEY);

module.exports = {
  signToken,
  verifyToken,
};
