const express = require("express");
const { body, param, query } = require("express-validator");

const { protect, optionalProtect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const { validate } = require("../middleware/validateMiddleware");

const {
  createItem,
  listItems,
  getItem,
  updateItem,
  deleteItem,
  myReports
} = require("../controllers/itemController");

const router = express.Router();

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
    query("query").optional().trim().isLength({ max: 80 }),
    query("category").optional().trim().isLength({ max: 60 }),
    query("colour").optional().trim().isLength({ max: 60 }),
    query("type").optional().isIn(["lost", "found"]),
    query("location").optional().trim().isLength({ max: 80 }),
    query("exactLocation").optional().trim().isLength({ max: 120 }),
    query("brand").optional().trim().isLength({ max: 80 }),
    query("model").optional().trim().isLength({ max: 80 }),
    query("status").optional().isIn(["pending", "active", "claimed", "solved", "rejected"]),
    query("sort").optional().isIn(["newest", "oldest", "date_desc", "date_asc"]),
    query("dateFrom").optional().isISO8601().toDate(),
    query("dateTo").optional().isISO8601().toDate()
  ],
  validate,
  listItems
);

router.get("/user/my-reports", protect, myReports);

router.get("/:id", optionalProtect, [param("id").isMongoId().withMessage("Invalid id")], validate, getItem);

router.post(
  "/:type(lost|found)",
  protect,
  upload.array("images", 6),
  [
    body("title").trim().isLength({ min: 3, max: 120 }).withMessage("Title is required"),
    body("description").trim().isLength({ min: 10, max: 2000 }).withMessage("Description is required"),
    body("category").trim().isLength({ min: 2, max: 60 }).withMessage("Category is required"),
    body("colour").trim().isLength({ min: 2, max: 60 }).withMessage("Colour is required"),
    body("location").trim().isLength({ min: 2, max: 160 }).withMessage("Location is required"),
    body("exactLocation").trim().isLength({ min: 2, max: 240 }).withMessage("Exact location is required"),
    body("date").isISO8601().withMessage("Valid date required"),
    body("brand").optional().trim().isLength({ max: 80 }),
    body("model").optional().trim().isLength({ max: 80 }),
    body("size").optional().trim().isLength({ max: 40 }),
    body("uniqueMarks").optional().trim().isLength({ max: 600 }),
    body("reward").optional().trim().isLength({ max: 60 }),
    body("preferredContactMethod").optional().trim().isLength({ max: 40 }),
    body("additionalNotes").optional().trim().isLength({ max: 2000 }),
    body("contactName").optional().trim().isLength({ max: 80 }),
    body("contactEmail").optional().isEmail().withMessage("Valid contact email required").optional({ nullable: true, checkFalsy: true }),
    body("contactPhone").optional().trim().isLength({ max: 40 }),
    body("lastSeenLocation").optional().trim().isLength({ max: 240 }),
    body("lastSeenTime").optional().trim().isLength({ max: 40 }),
    body("foundLocation").optional().trim().isLength({ max: 240 }),
    body("foundTime").optional().trim().isLength({ max: 40 }),
    body("whereStored").optional().trim().isLength({ max: 240 }),
    body("handoverLocation").optional().trim().isLength({ max: 240 })
  ],
  validate,
  createItem
);

router.put(
  "/:id",
  protect,
  upload.array("images", 6),
  [
    param("id").isMongoId(),
    body("title").optional().trim().isLength({ min: 3, max: 120 }),
    body("description").optional().trim().isLength({ min: 10, max: 4000 }),
    body("category").optional().trim().isLength({ min: 2, max: 60 }),
    body("colour").optional().trim().isLength({ min: 2, max: 60 }),
    body("location").optional().trim().isLength({ min: 2, max: 160 }),
    body("exactLocation").optional().trim().isLength({ min: 2, max: 240 }),
    body("date").optional().isISO8601(),
    body("brand").optional().trim().isLength({ max: 80 }),
    body("model").optional().trim().isLength({ max: 80 }),
    body("size").optional().trim().isLength({ max: 40 }),
    body("uniqueMarks").optional().trim().isLength({ max: 600 }),
    body("reward").optional().trim().isLength({ max: 60 }),
    body("preferredContactMethod").optional().trim().isLength({ max: 40 }),
    body("additionalNotes").optional().trim().isLength({ max: 2000 }),
    body("contactName").optional().trim().isLength({ max: 80 }),
    body("contactEmail").optional().isEmail().optional({ nullable: true, checkFalsy: true }),
    body("contactPhone").optional().trim().isLength({ max: 40 }),
    body("lastSeenLocation").optional().trim().isLength({ max: 240 }),
    body("lastSeenTime").optional().trim().isLength({ max: 40 }),
    body("foundLocation").optional().trim().isLength({ max: 240 }),
    body("foundTime").optional().trim().isLength({ max: 40 }),
    body("whereStored").optional().trim().isLength({ max: 240 }),
    body("handoverLocation").optional().trim().isLength({ max: 240 })
  ],
  validate,
  updateItem
);

router.delete("/:id", protect, [param("id").isMongoId()], validate, deleteItem);

module.exports = router;
