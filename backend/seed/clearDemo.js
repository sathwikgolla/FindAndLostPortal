const dotenv = require("dotenv");
const { connectDB } = require("../config/db");
const User = require("../models/User");
const Item = require("../models/Item");
const Notification = require("../models/Notification");
const ClaimRequest = require("../models/ClaimRequest");
const AdminLog = require("../models/AdminLog");

dotenv.config();

async function run() {
  await connectDB(process.env.MONGO_URI);

  const dryRun = process.argv.includes("--dry-run");
  const onlySeedUsers = process.argv.includes("--only-seed-users");

  const seedEmails = ["admin@findandlost.dev", "user@findandlost.dev"];
  const userFilter = onlySeedUsers ? { email: { $in: seedEmails } } : {};

  if (dryRun) {
    const [users, items, notifs, claims, logs] = await Promise.all([
      User.countDocuments(userFilter),
      Item.countDocuments({}),
      Notification.countDocuments({}),
      ClaimRequest.countDocuments({}),
      AdminLog.countDocuments({})
    ]);
    // eslint-disable-next-line no-console
    console.log("DRY RUN - would delete:", { users, items, notifications: notifs, claims, adminLogs: logs });
    process.exit(0);
  }

  await Promise.all([
    User.deleteMany(userFilter),
    Item.deleteMany({}),
    Notification.deleteMany({}),
    ClaimRequest.deleteMany({}),
    AdminLog.deleteMany({})
  ]);

  // eslint-disable-next-line no-console
  console.log("Cleared demo data.");
  process.exit(0);
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

