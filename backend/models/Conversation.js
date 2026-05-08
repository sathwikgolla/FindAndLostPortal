const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true, index: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "solved", "closed"], default: "active", index: true },
    solvedByOwner: { type: Boolean, default: false },
    solvedByFinder: { type: Boolean, default: false },
    solvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

conversationSchema.index({ itemId: 1, participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);

