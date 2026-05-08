const express = require("express");
const { param } = require("express-validator");

const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  stats,
  listUsers,
  listItems,
  approveItemAdmin,
  rejectItemAdmin,
  removeItem,
  listClaims,
  listLogs
} = require("../controllers/adminController");

const router = express.Router();

router.use(protect, requireRole("admin"));

router.get("/stats", stats);
router.get("/users", listUsers);
router.get("/items", listItems);
router.put("/items/:id/approve", [param("id").isMongoId()], validate, approveItemAdmin);
router.put("/items/:id/reject", [param("id").isMongoId()], validate, rejectItemAdmin);
router.delete("/items/:id", [param("id").isMongoId()], validate, removeItem);
router.get("/claims", listClaims);
router.get("/logs", listLogs);

module.exports = router;

