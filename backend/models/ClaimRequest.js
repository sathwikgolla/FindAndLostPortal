const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true, index: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, trim: true, maxlength: 1200, default: "" },
    proofDetails: { type: String, trim: true, maxlength: 2000, default: "" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClaimRequest", claimSchema);

