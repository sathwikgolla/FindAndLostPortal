const jwt = require("jsonwebtoken");

function generateToken(userId) {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
}

function generateRefreshToken(userId) {
  const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";
  return jwt.sign({ id: userId, typ: "refresh" }, secret, { expiresIn });
}

module.exports = { generateToken, generateRefreshToken };
