const Item = require("../models/Item");
const ClaimRequest = require("../models/ClaimRequest");
const Notification = require("../models/Notification");
const { ok } = require("../utils/response");

async function stats(req, res, next) {
  try {
    const [myReports, myClaims, unreadNotifications] = await Promise.all([
      Item.countDocuments({ reportedBy: req.user._id }),
      ClaimRequest.countDocuments({ requestedBy: req.user._id }),
      Notification.countDocuments({ userId: req.user._id, isRead: false })
    ]);
    return ok(res, { data: { myReports, myClaims, unreadNotifications } });
  } catch (e) {
    next(e);
  }
}

async function recentItems(req, res, next) {
  try {
    const items = await Item.find({ status: "active" }).sort({ createdAt: -1 }).limit(12);
    return ok(res, { data: { items } });
  } catch (e) {
    next(e);
  }
}

async function myActivity(req, res, next) {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(12);
    const receivedClaims = await ClaimRequest.find({ ownerId: req.user._id }).sort({ createdAt: -1 }).limit(8);
    return ok(res, { data: { notifications, receivedClaims } });
  } catch (e) {
    next(e);
  }
}

module.exports = { stats, recentItems, myActivity };

