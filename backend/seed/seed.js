const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");
const User = require("../models/User");
const Item = require("../models/Item");
const Notification = require("../models/Notification");
const ClaimRequest = require("../models/ClaimRequest");

dotenv.config();

async function run() {
  await connectDB(process.env.MONGO_URI);

  await Promise.all([User.deleteMany({}), Item.deleteMany({}), Notification.deleteMany({}), ClaimRequest.deleteMany({})]);

  const salt = await bcrypt.genSalt(12);
  const adminPass = await bcrypt.hash("Admin123!", salt);
  const userPass = await bcrypt.hash("User123!", salt);

  const admin = await User.create({
    name: "Admin",
    email: "admin@findandlost.dev",
    password: adminPass,
    role: "admin",
    isVerified: true
  });

  const user = await User.create({
    name: "Demo User",
    email: "user@findandlost.dev",
    password: userPass,
    role: "user",
    isVerified: true
  });

  const items = await Item.insertMany([
    {
      title: "Leather Wallet (Brown)",
      description: "Brown leather wallet with a gold zipper. Contains ID and cards.",
      category: "Accessories",
      type: "lost",
      location: "Connaught Place, Delhi",
      date: new Date("2026-04-23"),
      imageUrl: [],
      contactInfo: { name: "Demo User", email: "user@findandlost.dev" },
      reportedBy: user._id,
      status: "active"
    },
    {
      title: "Wallet found near CP metro",
      description: "Found a brown wallet near the metro entrance. Has cards inside.",
      category: "Accessories",
      type: "found",
      location: "Connaught Place, Delhi",
      date: new Date("2026-04-24"),
      imageUrl: [],
      contactInfo: { name: "Admin", email: "admin@findandlost.dev" },
      reportedBy: admin._id,
      status: "active"
    },
    {
      title: "iPhone 14 (Black)",
      description: "Found near the platform bench. Screen has a small crack on top-right.",
      category: "Electronics",
      type: "found",
      location: "Bengaluru Metro - MG Road",
      date: new Date("2026-04-28"),
      imageUrl: [],
      contactInfo: { name: "Admin", email: "admin@findandlost.dev" },
      reportedBy: admin._id,
      status: "active"
    }
  ]);

  await Notification.insertMany([
    { userId: user._id, title: "Item approved", message: "Your report is active and visible on Browse.", type: "admin" },
    { userId: user._id, title: "Possible match found", message: "We found a possible match for your report.", type: "match" }
  ]);

  // eslint-disable-next-line no-console
  console.log("Seed complete:");
  // eslint-disable-next-line no-console
  console.log({ adminEmail: admin.email, userEmail: user.email, items: items.length });
  process.exit(0);
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

