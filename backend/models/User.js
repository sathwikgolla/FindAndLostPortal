const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
    avatar: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    refreshTokenHash: { type: String, default: "", select: false },
    refreshTokenExpiresAt: { type: Date, default: null, select: false },
    emailOtpHash: { type: String, default: "", select: false },
    emailOtpExpiresAt: { type: Date, default: null, select: false }
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    avatar: this.avatar,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model("User", userSchema);
