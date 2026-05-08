const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateToken, generateRefreshToken } = require("../utils/generateToken");
const { ok, created } = require("../utils/response");
const { sendEmail } = require("../utils/sendEmail");

function sha256(input) {
  return crypto.createHash("sha256").update(String(input)).digest("hex");
}

function getCookie(req, name) {
  const header = req.headers.cookie || "";
  const cookies = header.split(";").map((c) => c.trim());
  for (const c of cookies) {
    if (!c) continue;
    const idx = c.indexOf("=");
    if (idx === -1) continue;
    const k = c.slice(0, idx).trim();
    const v = c.slice(idx + 1);
    if (k === name) return decodeURIComponent(v);
  }
  return null;
}

function setRefreshCookie(res, token) {
  const secure = String(process.env.NODE_ENV || "").toLowerCase() === "production";
  const sameSite = secure ? "None" : "Lax";
  const maxAge = 60 * 60 * 24 * 30; // seconds
  const parts = [
    `findandlost_refresh=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/api/auth/refresh",
    `Max-Age=${maxAge}`,
    `SameSite=${sameSite}`
  ];
  if (secure) parts.push("Secure");
  const existing = res.getHeader("Set-Cookie");
  const next = Array.isArray(existing) ? [...existing, parts.join("; ")] : existing ? [existing, parts.join("; ")] : [parts.join("; ")];
  res.setHeader("Set-Cookie", next);
}

function clearRefreshCookie(res) {
  const secure = String(process.env.NODE_ENV || "").toLowerCase() === "production";
  const sameSite = secure ? "None" : "Lax";
  const parts = [
    "findandlost_refresh=",
    "HttpOnly",
    "Path=/api/auth/refresh",
    "Max-Age=0",
    `SameSite=${sameSite}`
  ];
  if (secure) parts.push("Secure");
  const existing = res.getHeader("Set-Cookie");
  const next = Array.isArray(existing) ? [...existing, parts.join("; ")] : existing ? [existing, parts.join("; ")] : [parts.join("; ")];
  res.setHeader("Set-Cookie", next);
}

async function register(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const phone = String(req.body.phone || "").trim();

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409);
      throw new Error("Email already in use");
    }
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);

    const verificationRequired = String(process.env.EMAIL_VERIFICATION_REQUIRED || "").toLowerCase() === "true";
    const user = await User.create({ name, email, password: hashed, phone, role: "user", isVerified: !verificationRequired });

    if (verificationRequired) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.emailOtpHash = sha256(otp);
      user.emailOtpExpiresAt = new Date(Date.now() + 1000 * 60 * 10);
      await user.save();
      const subject = "Verify your FindAndLost email";
      const text = `Your verification code is: ${otp}. This code expires in 10 minutes.`;
      const sent = await sendEmail({ to: email, subject, text });
      // If email isn't configured, do not block local development.
      if (sent?.skipped) {
        user.isVerified = true;
        user.emailOtpHash = "";
        user.emailOtpExpiresAt = null;
        await user.save();
      }
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokenHash = sha256(refreshToken);
    user.refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await user.save();
    setRefreshCookie(res, refreshToken);
    return created(res, { message: "Registered", data: { user: user.toSafeJSON(), token } });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }
    if (!user.isVerified) {
      res.status(403);
      throw new Error("Please verify your email before logging in.");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401);
      throw new Error("Invalid credentials");
    }
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          refreshTokenHash: sha256(refreshToken),
          refreshTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        }
      }
    );
    setRefreshCookie(res, refreshToken);
    const safe = await User.findById(user._id);
    return ok(res, { message: "Logged in", data: { user: safe.toSafeJSON(), token } });
  } catch (e) {
    next(e);
  }
}

async function me(req, res) {
  return ok(res, { data: { user: req.user } });
}

async function refresh(req, res, next) {
  try {
    const raw = getCookie(req, "findandlost_refresh");
    if (!raw) {
      res.status(401);
      throw new Error("Not authorized");
    }
    const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(raw, secret);
    const user = await User.findById(decoded.id).select("+refreshTokenHash +refreshTokenExpiresAt");
    if (!user || !user.refreshTokenHash) {
      res.status(401);
      throw new Error("Not authorized");
    }
    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt.getTime() < Date.now()) {
      res.status(401);
      throw new Error("Not authorized");
    }
    if (user.refreshTokenHash !== sha256(raw)) {
      res.status(401);
      throw new Error("Not authorized");
    }

    // Rotate refresh token
    const newRefresh = generateRefreshToken(user._id);
    user.refreshTokenHash = sha256(newRefresh);
    user.refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await user.save();
    setRefreshCookie(res, newRefresh);

    const token = generateToken(user._id);
    const safe = await User.findById(user._id);
    return ok(res, { message: "Refreshed", data: { token, user: safe.toSafeJSON() } });
  } catch (e) {
    next(e);
  }
}

async function logout(req, res, next) {
  try {
    const raw = getCookie(req, "findandlost_refresh");
    if (raw) {
      const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
      try {
        const decoded = jwt.verify(raw, secret);
        await User.updateOne(
          { _id: decoded.id },
          { $set: { refreshTokenHash: "", refreshTokenExpiresAt: null } }
        );
      } catch {
        // ignore
      }
    }
    clearRefreshCookie(res);
    return ok(res, { message: "Logged out" });
  } catch (e) {
    next(e);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();
    const user = await User.findOne({ email }).select("+emailOtpHash +emailOtpExpiresAt");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.isVerified) return ok(res, { message: "Already verified" });
    if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
      res.status(400);
      throw new Error("No verification pending");
    }
    if (user.emailOtpExpiresAt.getTime() < Date.now()) {
      res.status(400);
      throw new Error("Verification code expired");
    }
    if (sha256(otp) !== user.emailOtpHash) {
      res.status(400);
      throw new Error("Invalid verification code");
    }
    user.isVerified = true;
    user.emailOtpHash = "";
    user.emailOtpExpiresAt = null;
    await user.save();
    return ok(res, { message: "Email verified" });
  } catch (e) {
    next(e);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    return ok(res, { message: "Profile updated", data: { user: user.toSafeJSON() } });
  } catch (e) {
    next(e);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return ok(res, { message: "Password updated" });
  } catch (e) {
    next(e);
  }
}

module.exports = { register, login, me, refresh, logout, verifyEmail, updateProfile, changePassword };
