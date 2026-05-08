const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { requireAllowedOrigin } = require("../middleware/originGuard");

const { register, login, me, refresh, logout, verifyEmail, updateProfile, changePassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name is required"),
    body("email")
      .trim()
      .toLowerCase()
      .custom((v) => EMAIL_REGEX.test(String(v || "")))
      .withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8, max: 72 })
      .withMessage("Password must be at least 8 characters")
      .custom((v) => STRONG_PASSWORD_REGEX.test(String(v || "")))
      .withMessage("Password must include uppercase, lowercase, number, and special character"),
    body("phone")
      .trim()
      .custom((v) => /^\d{10}$/.test(String(v || "")))
      .withMessage("Valid 10-digit phone required")
  ],
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  [
    body("email")
      .trim()
      .toLowerCase()
      .custom((v) => EMAIL_REGEX.test(String(v || "")))
      .withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required")
  ],
  validate,
  login
);

router.get("/me", protect, me);
router.post("/logout", authLimiter, requireAllowedOrigin, logout);
router.get("/refresh", authLimiter, requireAllowedOrigin, refresh);
router.post(
  "/verify-email",
  authLimiter,
  [
    body("email").trim().toLowerCase().custom((v) => EMAIL_REGEX.test(String(v || ""))).withMessage("Valid email required"),
    body("otp").trim().isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
  ],
  validate,
  verifyEmail
);

router.put(
  "/update-profile",
  protect,
  [
    body("name").optional().trim().isLength({ min: 2, max: 80 }).withMessage("Invalid name"),
    body("phone").optional().trim().isLength({ max: 30 }).withMessage("Invalid phone"),
    body("avatar").optional().trim().isLength({ max: 300 }).withMessage("Invalid avatar URL")
  ],
  validate,
  updateProfile
);

router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").isLength({ min: 8, max: 72 }).withMessage("Invalid current password"),
    body("newPassword")
      .isLength({ min: 8, max: 72 })
      .withMessage("Invalid new password")
      .custom((v) => STRONG_PASSWORD_REGEX.test(String(v || "")))
      .withMessage("New password must include uppercase, lowercase, number, and special character")
  ],
  validate,
  changePassword
);

module.exports = router;
