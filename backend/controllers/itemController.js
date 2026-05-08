const Item = require("../models/Item");
const { ok, created } = require("../utils/response");
const { uploadImagesToCloudinary } = require("../utils/uploadToCloudinary");
const { findMatchesForItem } = require("../utils/matchItems");
const { createNotification } = require("../utils/createNotification");

function buildQuery({ query, category, colour, type, location, exactLocation, brand, model, status, dateFrom, dateTo }) {
  const q = {};
  if (status) q.status = status;
  if (category) q.category = category;
  if (colour) q.colour = colour;
  if (type) q.type = type;
  if (location) q.location = new RegExp(location, "i");
  if (exactLocation) q.exactLocation = new RegExp(exactLocation, "i");
  if (brand) q.brand = new RegExp(brand, "i");
  if (model) q.model = new RegExp(model, "i");
  if (dateFrom || dateTo) {
    q.date = {};
    if (dateFrom) q.date.$gte = dateFrom;
    if (dateTo) q.date.$lte = dateTo;
  }
  if (query) {
    q.$or = [
      { title: new RegExp(query, "i") },
      { description: new RegExp(query, "i") },
      { category: new RegExp(query, "i") },
      { colour: new RegExp(query, "i") },
      { brand: new RegExp(query, "i") },
      { model: new RegExp(query, "i") },
      { location: new RegExp(query, "i") },
      { exactLocation: new RegExp(query, "i") },
      { uniqueMarks: new RegExp(query, "i") }
    ];
  }
  return q;
}

function parseSort(sort) {
  switch (sort) {
    case "newest":
      return { createdAt: -1 };
    case "oldest":
      return { createdAt: 1 };
    case "date_desc":
      return { date: -1 };
    case "date_asc":
      return { date: 1 };
    default:
      return { createdAt: -1 };
  }
}

async function createItem(req, res, next) {
  try {
    const {
      title,
      description,
      category,
      colour,
      location,
      exactLocation,
      date,
      brand,
      model,
      size,
      uniqueMarks,
      reward,
      preferredContactMethod,
      additionalNotes,
      contactName,
      contactEmail,
      contactPhone,
      lastSeenLocation,
      lastSeenTime,
      foundLocation,
      foundTime,
      whereStored,
      handoverLocation
    } = req.body;
    const type = req.params.type; // lost|found
    const moderationEnabled = String(process.env.MODERATION_ENABLED || "").toLowerCase() === "true";

    let imageUrls = [];
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      res.status(500);
      throw new Error("Image upload not configured");
    }
    if (!req.files || !req.files.length) {
      res.status(400);
      throw new Error("Item image is required");
    }
    imageUrls = await uploadImagesToCloudinary(req.files, { folder: "findandlost/items" });
    if (!imageUrls.length) {
      res.status(400);
      throw new Error("Item image is required");
    }

    const item = await Item.create({
      title,
      description,
      category,
      colour,
      type,
      location,
      exactLocation,
      date,
      brand,
      model,
      size,
      uniqueMarks,
      reward,
      preferredContactMethod,
      additionalNotes,
      lastSeenLocation,
      lastSeenTime,
      foundLocation,
      foundTime,
      whereStored,
      handoverLocation,
      imageUrl: imageUrls,
      contactInfo: {
        name: contactName || "",
        email: contactEmail || "",
        phone: contactPhone || ""
      },
      reportedBy: req.user._id,
      status: moderationEnabled ? "pending" : "active"
    });

    // Fire-and-forget match computation for active items.
    if (!moderationEnabled) {
      recomputeMatchesAndNotify(item).catch(() => {});
    }

    return created(res, {
      message: moderationEnabled ? "Item reported (pending approval)" : "Item reported (publicly visible)",
      data: { item }
    });
  } catch (e) {
    next(e);
  }
}

async function listItems(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 12)));

    const query = req.query.query ? String(req.query.query) : "";
    const category = req.query.category ? String(req.query.category) : "";
    const colour = req.query.colour ? String(req.query.colour) : "";
    const type = req.query.type ? String(req.query.type) : "";
    const location = req.query.location ? String(req.query.location) : "";
    const exactLocation = req.query.exactLocation ? String(req.query.exactLocation) : "";
    const brand = req.query.brand ? String(req.query.brand) : "";
    const model = req.query.model ? String(req.query.model) : "";
    const status = req.query.status ? String(req.query.status) : "";
    const dateFrom = req.query.dateFrom ? req.query.dateFrom : null;
    const dateTo = req.query.dateTo ? req.query.dateTo : null;

    const q = buildQuery({ query, category, colour, type, location, exactLocation, brand, model, status, dateFrom, dateTo });

    // Browse should show only active items by default.
    if (!status) q.status = "active";

    const total = await Item.countDocuments(q);
    const items = await Item.find(q)
      .populate("reportedBy", "name email avatar")
      .sort(parseSort(String(req.query.sort || "newest")))
      .skip((page - 1) * limit)
      .limit(limit);

    return ok(res, {
      data: { items },
      meta: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (e) {
    next(e);
  }
}

async function getItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id).populate("reportedBy", "name email phone avatar");
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    // Only active items are public; owner/admin can see any.
    // Solved items are not public; only owner/admin can see them here.
    if (item.status !== "active" && String(item.reportedBy?._id) !== String(req.user?._id) && req.user?.role !== "admin") {
      res.status(403);
      throw new Error("Forbidden");
    }
    return ok(res, { data: { item } });
  } catch (e) {
    next(e);
  }
}

async function updateItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    const isOwner = String(item.reportedBy) === String(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Forbidden");
    }
    const moderationEnabled = String(process.env.MODERATION_ENABLED || "").toLowerCase() === "true";

    const fields = [
      "title",
      "description",
      "category",
      "colour",
      "location",
      "exactLocation",
      "date",
      "brand",
      "model",
      "size",
      "uniqueMarks",
      "reward",
      "preferredContactMethod",
      "additionalNotes",
      "lastSeenLocation",
      "lastSeenTime",
      "foundLocation",
      "foundTime",
      "whereStored",
      "handoverLocation"
    ];
    for (const f of fields) {
      if (req.body[f] !== undefined) item[f] = req.body[f];
    }

    if (req.files && req.files.length) {
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        res.status(500);
        throw new Error("Image upload not configured");
      }
      const imageUrls = await uploadImagesToCloudinary(req.files, { folder: "findandlost/items" });
      item.imageUrl = [...item.imageUrl, ...imageUrls].slice(0, 8);
    }

    if (req.body.contactName !== undefined || req.body.contactEmail !== undefined || req.body.contactPhone !== undefined) {
      item.contactInfo = {
        name: req.body.contactName ?? item.contactInfo?.name ?? "",
        email: req.body.contactEmail ?? item.contactInfo?.email ?? "",
        phone: req.body.contactPhone ?? item.contactInfo?.phone ?? ""
      };
    }

    // Editing only sets back to pending if moderation is enabled and the editor isn't admin.
    if (moderationEnabled && req.user.role !== "admin") item.status = "pending";
    // If moderation is disabled, keep items public (unless already claimed/solved).
    if (!moderationEnabled && item.status !== "claimed" && item.status !== "solved") item.status = "active";

    await item.save();
    return ok(res, { message: "Item updated", data: { item } });
  } catch (e) {
    next(e);
  }
}

async function deleteItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    const isOwner = String(item.reportedBy) === String(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Forbidden");
    }
    await item.deleteOne();
    return ok(res, { message: "Item deleted" });
  } catch (e) {
    next(e);
  }
}

async function myReports(req, res, next) {
  try {
    const items = await Item.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    return ok(res, { data: { items } });
  } catch (e) {
    next(e);
  }
}

async function recomputeMatchesAndNotify(item) {
  const candidates = await Item.find({ status: "active", type: item.type === "lost" ? "found" : "lost" }).select("title description category type location");
  const matches = findMatchesForItem(item, candidates);
  item.matchedItems = matches;
  await item.save();

  if (matches.length) {
    await createNotification({
      userId: item.reportedBy,
      type: "match",
      title: "Possible match found",
      message: `We found ${matches.length} possible match(es) for your report. Check the item details page.`
    });
  }
}

async function approveItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    item.status = "active";
    await item.save();
    await createNotification({ userId: item.reportedBy, type: "admin", title: "Item approved", message: "Your item report is now active." });
    await recomputeMatchesAndNotify(item);
    return ok(res, { message: "Approved", data: { item } });
  } catch (e) {
    next(e);
  }
}

async function rejectItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    item.status = "rejected";
    await item.save();
    await createNotification({ userId: item.reportedBy, type: "admin", title: "Item rejected", message: "Your item report was rejected. You may edit and resubmit." });
    return ok(res, { message: "Rejected", data: { item } });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createItem,
  listItems,
  getItem,
  updateItem,
  deleteItem,
  myReports,
  approveItem,
  rejectItem
};
