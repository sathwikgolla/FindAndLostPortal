const express = require("express");
const { param, query } = require("express-validator");

const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { listNotifications, markRead, markAllRead, removeNotification } = require("../controllers/notificationController");

const router = express.Router();

router.get(
  "/",
  protect,
  [query("page").optional().isInt({ min: 1 }).toInt(), query("limit").optional().isInt({ min: 1, max: 50 }).toInt()],
  validate,
  listNotifications
);

router.put("/:id/read", protect, [param("id").isMongoId()], validate, markRead);
router.put("/read-all", protect, markAllRead);
router.delete("/:id", protect, [param("id").isMongoId()], validate, removeNotification);

module.exports = router;

