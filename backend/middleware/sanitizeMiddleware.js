function stripDangerousKeys(value) {
  if (!value) return value;
  if (Array.isArray(value)) return value.map(stripDangerousKeys);
  if (typeof value !== "object") return value;
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (k.includes("$") || k.includes(".")) continue;
    out[k] = stripDangerousKeys(v);
  }
  return out;
}

function sanitizeObject(obj) {
  return stripDangerousKeys(obj);
}

function sanitizeHtmlLike(input) {
  // Very small defensive sanitizer: remove tags and control chars.
  return String(input || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeRequest(req, res, next) {
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  next();
}

module.exports = { sanitizeRequest, sanitizeHtmlLike };

