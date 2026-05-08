const User = require("../models/User");
const Item = require("../models/Item");
const ClaimRequest = require("../models/ClaimRequest");
const AdminLog = require("../models/AdminLog");
const { ok } = require("../utils/response");
const { approveItem, rejectItem } = require("./itemController");

async function stats(req, res, next) {
  try {
    const [users, itemsPending, itemsActive, claimsPending] = await Promise.all([
      User.countDocuments({}),
      Item.countDocuments({ status: "pending" }),
      Item.countDocuments({ status: "active" }),
      ClaimRequest.countDocuments({ status: "pending" })
    ]);
    return ok(res, { data: { users, itemsPending, itemsActive, claimsPending } });
  } catch (e) {
    next(e);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select("-password");
    return ok(res, { data: { users } });
  } catch (e) {
    next(e);
  }
}

async function listItems(req, res, next) {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 }).populate("reportedBy", "name email role");
    return ok(res, { data: { items } });
  } catch (e) {
    next(e);
  }
}

async function removeItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    await item.deleteOne();
    await AdminLog.create({
      adminId: req.user._id,
      action: "ITEM_DELETE",
      targetType: "Item",
      targetId: item._id,
      description: "Deleted item"
    });
    return ok(res, { message: "Item deleted" });
  } catch (e) {
    next(e);
  }
}

async function approveItemAdmin(req, res, next) {
  await AdminLog.create({
    adminId: req.user._id,
    action: "ITEM_APPROVE",
    targetType: "Item",
    targetId: req.params.id,
    description: "Approved item"
  });
  return approveItem(req, res, next);
}

async function rejectItemAdmin(req, res, next) {
  await AdminLog.create({
    adminId: req.user._id,
    action: "ITEM_REJECT",
    targetType: "Item",
    targetId: req.params.id,
    description: "Rejected item"
  });
  return rejectItem(req, res, next);
}

async function listClaims(req, res, next) {
  try {
    const claims = await ClaimRequest.find({}).sort({ createdAt: -1 }).populate("itemId").populate("requestedBy", "name email").populate("ownerId", "name email");
    return ok(res, { data: { claims } });
  } catch (e) {
    next(e);
  }
}

async function listLogs(req, res, next) {
  try {
    const logs = await AdminLog.find({}).sort({ createdAt: -1 }).populate("adminId", "name email");
    return ok(res, { data: { logs } });
  } catch (e) {
    next(e);
  }
}

module.exports = { stats, listUsers, listItems, approveItemAdmin, rejectItemAdmin, removeItem, listClaims, listLogs };

