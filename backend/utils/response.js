function ok(res, { message = "OK", data = null, meta = undefined } = {}) {
  return res.json({ success: true, message, data, meta });
}

function created(res, { message = "Created", data = null, meta = undefined } = {}) {
  return res.status(201).json({ success: true, message, data, meta });
}

module.exports = { ok, created };

