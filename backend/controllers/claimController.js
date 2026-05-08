const ClaimRequest = require("../models/ClaimRequest");
const Item = require("../models/Item");
const { ok, created } = require("../utils/response");
const { createNotification } = require("../utils/createNotification");

async function createClaim(req, res, next) {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    if (item.status !== "active") {
      res.status(400);
      throw new Error("Claims allowed only for active items");
    }
    if (String(item.reportedBy) === String(req.user._id)) {
      res.status(400);
      throw new Error("You cannot claim your own item");
    }

    const exists = await ClaimRequest.findOne({ itemId: item._id, requestedBy: req.user._id, status: "pending" });
    if (exists) {
      res.status(409);
      throw new Error("You already have a pending claim for this item");
    }

    const claim = await ClaimRequest.create({
      itemId: item._id,
      requestedBy: req.user._id,
      ownerId: item.reportedBy,
      message: req.body.message || "",
      proofDetails: req.body.proofDetails || "",
      status: "pending"
    });

    await createNotification({
      userId: item.reportedBy,
      type: "claim",
      title: "New claim request",
      message: "A user submitted a claim request for your item. Review it in your received claims."
    });

    return created(res, { message: "Claim request created", data: { claim } });
  } catch (e) {
    next(e);
  }
}

async function myClaims(req, res, next) {
  try {
    const claims = await ClaimRequest.find({ requestedBy: req.user._id })
      .populate("itemId")
      .sort({ createdAt: -1 });
    return ok(res, { data: { claims } });
  } catch (e) {
    next(e);
  }
}

async function receivedClaims(req, res, next) {
  try {
    const claims = await ClaimRequest.find({ ownerId: req.user._id })
      .populate("itemId")
      .populate("requestedBy", "name email avatar")
      .sort({ createdAt: -1 });
    return ok(res, { data: { claims } });
  } catch (e) {
    next(e);
  }
}

async function approveClaim(req, res, next) {
  try {
    const claim = await ClaimRequest.findById(req.params.id);
    if (!claim) {
      res.status(404);
      throw new Error("Claim not found");
    }
    if (String(claim.ownerId) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Forbidden");
    }
    if (claim.status !== "pending") {
      res.status(400);
      throw new Error("Claim already processed");
    }

    claim.status = "approved";
    await claim.save();

    const item = await Item.findById(claim.itemId);
    if (item) {
      item.status = "claimed";
      await item.save();
    }

    await createNotification({
      userId: claim.requestedBy,
      type: "claim",
      title: "Claim approved",
      message: "Your claim request was approved. Follow up with the owner via the contact flow."
    });

    return ok(res, { message: "Claim approved", data: { claim } });
  } catch (e) {
    next(e);
  }
}

async function rejectClaim(req, res, next) {
  try {
    const claim = await ClaimRequest.findById(req.params.id);
    if (!claim) {
      res.status(404);
      throw new Error("Claim not found");
    }
    if (String(claim.ownerId) !== String(req.user._id) && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Forbidden");
    }
    if (claim.status !== "pending") {
      res.status(400);
      throw new Error("Claim already processed");
    }
    claim.status = "rejected";
    await claim.save();

    await createNotification({
      userId: claim.requestedBy,
      type: "claim",
      title: "Claim rejected",
      message: "Your claim request was rejected. You may try again with better proof details."
    });

    return ok(res, { message: "Claim rejected", data: { claim } });
  } catch (e) {
    next(e);
  }
}

module.exports = { createClaim, myClaims, receivedClaims, approveClaim, rejectClaim };

