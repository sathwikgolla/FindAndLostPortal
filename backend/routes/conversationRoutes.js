const express = require("express");
const rateLimit = require("express-rate-limit");
const { body, param } = require("express-validator");

const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  startConversation,
  listConversations,
  getConversation,
  sendMessage,
  markRead,
  solveConversation
} = require("../controllers/conversationController");

const router = express.Router();

const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

router.post("/start/:itemId", protect, [param("itemId").isMongoId().withMessage("Invalid item id")], validate, startConversation);

router.get("/", protect, listConversations);

router.get("/:id", protect, [param("id").isMongoId().withMessage("Invalid conversation id")], validate, getConversation);

router.post(
  "/:id/messages",
  protect,
  messageLimiter,
  [
    param("id").isMongoId().withMessage("Invalid conversation id"),
    body("text")
      .customSanitizer((v) => String(v || "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim())
      .isLength({ min: 1, max: 1000 })
      .withMessage("Message text is required (max 1000 chars)")
  ],
  validate,
  sendMessage
);

router.put("/:id/read", protect, [param("id").isMongoId().withMessage("Invalid conversation id")], validate, markRead);

router.put("/:id/solve", protect, [param("id").isMongoId().withMessage("Invalid conversation id")], validate, solveConversation);

module.exports = router;

