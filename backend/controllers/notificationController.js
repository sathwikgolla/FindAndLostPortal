const Notification = require("../models/Notification");
const { ok } = require("../utils/response");

async function listNotifications(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
    const q = { userId: req.user._id };
    const total = await Notification.countDocuments(q);
    const notifications = await Notification.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    return ok(res, { data: { notifications }, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) {
    next(e);
  }
}

async function markRead(req, res, next) {
  try {
    const n = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { isRead: true }, { new: true });
    if (!n) {
      res.status(404);
      throw new Error("Notification not found");
    }
    return ok(res, { message: "Marked as read", data: { notification: n } });
  } catch (e) {
    next(e);
  }
}

async function markAllRead(req, res, next) {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    return ok(res, { message: "All marked read" });
  } catch (e) {
    next(e);
  }
}

async function removeNotification(req, res, next) {
  try {
    const n = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!n) {
      res.status(404);
      throw new Error("Notification not found");
    }
    return ok(res, { message: "Deleted" });
  } catch (e) {
    next(e);
  }
}

module.exports = { listNotifications, markRead, markAllRead, removeNotification };

