const { validationResult } = require("express-validator");

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  res.status(400);
  return next({
    message: "Validation failed",
    errors: result.array().map((e) => ({ field: e.path, message: e.msg }))
  });
}

module.exports = { validate };

