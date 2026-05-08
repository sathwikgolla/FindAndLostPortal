const express = require("express");
const { body, param } = require("express-validator");

const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { createClaim, myClaims, receivedClaims, approveClaim, rejectClaim } = require("../controllers/claimController");

const router = express.Router();

router.post(
  "/:itemId",
  protect,
  [param("itemId").isMongoId(), body("message").optional().trim().isLength({ max: 1200 }), body("proofDetails").optional().trim().isLength({ max: 2000 })],
  validate,
  createClaim
);

router.get("/my-claims", protect, myClaims);
router.get("/received", protect, receivedClaims);

router.put("/:id/approve", protect, [param("id").isMongoId()], validate, approveClaim);
router.put("/:id/reject", protect, [param("id").isMongoId()], validate, rejectClaim);

module.exports = router;

