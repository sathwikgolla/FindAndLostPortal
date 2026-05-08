const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { stats, recentItems, myActivity } = require("../controllers/dashboardController");

const router = express.Router();

router.use(protect);

router.get("/stats", stats);
router.get("/recent-items", recentItems);
router.get("/my-activity", myActivity);

module.exports = router;

