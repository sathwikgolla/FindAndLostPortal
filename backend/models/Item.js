const mongoose = require("mongoose");

const matchedSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    score: { type: Number, required: true, min: 0, max: 100 }
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    category: { type: String, required: true, trim: true, index: true },
    colour: { type: String, required: true, trim: true, maxlength: 60, index: true },
    type: { type: String, enum: ["lost", "found"], required: true, index: true },
    location: { type: String, required: true, trim: true, maxlength: 160, index: true },
    exactLocation: { type: String, required: true, trim: true, maxlength: 240, index: true },
    date: { type: Date, required: true, index: true },
    // Optional extra fields
    brand: { type: String, trim: true, maxlength: 80, default: "" },
    model: { type: String, trim: true, maxlength: 80, default: "" },
    size: { type: String, trim: true, maxlength: 40, default: "" },
    uniqueMarks: { type: String, trim: true, maxlength: 600, default: "" },
    reward: { type: String, trim: true, maxlength: 60, default: "" },
    preferredContactMethod: { type: String, trim: true, maxlength: 40, default: "" },
    additionalNotes: { type: String, trim: true, maxlength: 2000, default: "" },
    // Lost-specific
    lastSeenLocation: { type: String, trim: true, maxlength: 240, default: "" },
    lastSeenTime: { type: String, trim: true, maxlength: 40, default: "" },
    // Found-specific
    foundLocation: { type: String, trim: true, maxlength: 240, default: "" },
    foundTime: { type: String, trim: true, maxlength: 40, default: "" },
    whereStored: { type: String, trim: true, maxlength: 240, default: "" },
    handoverLocation: { type: String, trim: true, maxlength: 240, default: "" },
    imageUrl: { type: [String], default: [] },
    contactInfo: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, trim: true }
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["pending", "active", "claimed", "solved", "rejected"], default: "pending", index: true },
    matchedItems: { type: [matchedSchema], default: [] },
    solvedConversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", default: null, index: true },
    solvedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

itemSchema.index({
  title: "text",
  description: "text",
  category: "text",
  colour: "text",
  brand: "text",
  model: "text",
  location: "text",
  exactLocation: "text",
  uniqueMarks: "text"
});

module.exports = mongoose.model("Item", itemSchema);
