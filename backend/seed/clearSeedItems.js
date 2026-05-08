/* eslint-disable no-console */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Item = require("../models/Item");
const connectDB = require("../config/db");

const SEEDED_TITLES = [
  "Leather Wallet",
  "iPhone 14",
  "Blue Backpack",
  "Student ID Card",
  "AirPods Pro",
  "Keys with Honda Keychain"
];

async function run() {
  const dryRun = process.argv.includes("--dry-run");
  await connectDB();

  const q = { title: { $in: SEEDED_TITLES } };
  const matches = await Item.find(q).select("_id title type status createdAt").lean();

  if (!matches.length) {
    console.log("No seeded/demo items found by title match.");
    await mongoose.connection.close();
    return;
  }

  console.log(`Found ${matches.length} possible seeded/demo item(s):`);
  for (const m of matches) {
    console.log(`- ${m._id} | ${m.title} | ${m.type} | ${m.status} | ${String(m.createdAt).slice(0, 10)}`);
  }

  if (dryRun) {
    console.log("Dry run enabled. No deletions performed.");
    await mongoose.connection.close();
    return;
  }

  const res = await Item.deleteMany(q);
  console.log(`Deleted ${res.deletedCount || 0} item(s).`);
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.connection.close();
  } catch {}
  process.exit(1);
});

