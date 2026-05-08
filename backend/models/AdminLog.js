const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    action: { type: String, required: true, trim: true, maxlength: 120, index: true },
    targetType: { type: String, required: true, trim: true, maxlength: 60, index: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    description: { type: String, trim: true, maxlength: 1200, default: "" }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("AdminLog", adminLogSchema);

