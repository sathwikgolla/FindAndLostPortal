function isAllowedOrigin(origin) {
  const allow = process.env.CLIENT_URL;
  if (!allow) return true;
  if (!origin) return true;
  const allowed = allow
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  if (allowed.includes(origin)) return true;
  const vercelBase = allowed.find((x) => x.endsWith(".vercel.app"));
  if (vercelBase) {
    const escaped = vercelBase.replace(/\./g, "\\.").replace(/^https?:\/\//, "");
    const re = new RegExp(`^https:\\/\\/[a-z0-9-]+\\.${escaped}$`, "i");
    if (re.test(origin)) return true;
  }
  return false;
}

function requireAllowedOrigin(req, res, next) {
  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin)) {
    res.status(403);
    return next(new Error("Forbidden"));
  }
  return next();
}

module.exports = { requireAllowedOrigin };

