const mongoose = require("mongoose");
const { ok, created } = require("../utils/response");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Item = require("../models/Item");
const { createNotification } = require("../utils/createNotification");

function cleanText(input) {
  return String(input || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isUserInParticipants(userId, participants) {
  const uid = String(userId);
  return (participants || []).some((p) => {
    const pid = p && typeof p === "object" ? p._id : p;
    return String(pid) === uid;
  });
}

async function requireConversationParticipant(res, req, conversation) {
  const userId = String(req.user._id);
  const okParticipant = isUserInParticipants(userId, conversation.participants);
  if (!okParticipant) {
    res.status(403);
    throw new Error("Forbidden");
  }
}

async function startConversation(req, res, next) {
  try {
    const item = await Item.findById(req.params.itemId).populate("reportedBy", "_id name email avatar phone");
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }
    const ownerId = String(item.reportedBy?._id || item.reportedBy);
    const me = String(req.user._id);
    if (ownerId === me) {
      res.status(400);
      throw new Error("You cannot start a conversation with your own item");
    }

    const participants = [new mongoose.Types.ObjectId(ownerId), new mongoose.Types.ObjectId(me)];

    const existing = await Conversation.findOne({
      itemId: item._id,
      participants: { $all: participants, $size: 2 }
    });
    if (existing) {
      return ok(res, { message: "Conversation exists", data: { conversation: existing } });
    }

    const conversation = await Conversation.create({
      itemId: item._id,
      participants,
      createdBy: req.user._id,
      status: "active"
    });

    const firstText = "Hi, I think I found your item.";
    await Message.create({
      conversationId: conversation._id,
      sender: req.user._id,
      receiver: ownerId,
      text: firstText,
      isRead: false
    });

    await createNotification({
      userId: ownerId,
      type: "info",
      title: "New conversation started",
      message: `${req.user.name} started a conversation about: ${item.title}`
    });

    return created(res, { message: "Conversation started", data: { conversation } });
  } catch (e) {
    next(e);
  }
}

async function listConversations(req, res, next) {
  try {
    const me = String(req.user._id);
    const conversations = await Conversation.find({ participants: req.user._id })
      .sort({ updatedAt: -1 })
      .populate("itemId", "title imageUrl status type location date")
      .populate("participants", "name email avatar")
      .lean();

    const convoWithMeta = await Promise.all(
      conversations.map(async (c) => {
        const last = await Message.findOne({ conversationId: c._id }).sort({ createdAt: -1 }).lean();
        const unread = await Message.countDocuments({ conversationId: c._id, receiver: req.user._id, isRead: false });
        const other = (c.participants || []).find((p) => String(p._id) !== me) || null;
        return {
          ...c,
          otherUser: other,
          lastMessage: last ? { _id: last._id, text: last.text, createdAt: last.createdAt, sender: last.sender } : null,
          unreadCount: unread
        };
      })
    );

    return ok(res, { data: { conversations: convoWithMeta } });
  } catch (e) {
    next(e);
  }
}

async function getConversation(req, res, next) {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("itemId", "title imageUrl status type location exactLocation colour date description reportedBy createdAt")
      .populate("participants", "name email avatar phone")
      .populate("createdBy", "name email avatar")
      .lean();
    if (!conversation) {
      res.status(404);
      throw new Error("Conversation not found");
    }
    await requireConversationParticipant(res, req, conversation);

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatar")
      .populate("receiver", "name avatar")
      .lean();

    return ok(res, { data: { conversation, messages } });
  } catch (e) {
    next(e);
  }
}

async function sendMessage(req, res, next) {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      res.status(404);
      throw new Error("Conversation not found");
    }
    await requireConversationParticipant(res, req, conversation);
    if (conversation.status !== "active") {
      res.status(400);
      throw new Error("Conversation is not active");
    }

    const text = cleanText(req.body.text);
    if (!text) {
      res.status(400);
      throw new Error("Message text is required");
    }
    if (text.length > 1000) {
      res.status(400);
      throw new Error("Message too long");
    }

    const me = String(req.user._id);
    const receiver = (conversation.participants || []).find((p) => String(p) !== me);
    if (!receiver) {
      res.status(400);
      throw new Error("Receiver not found");
    }

    const msg = await Message.create({
      conversationId: conversation._id,
      sender: req.user._id,
      receiver,
      text,
      isRead: false
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    await createNotification({
      userId: receiver,
      type: "info",
      title: "New message",
      message: `${req.user.name} sent you a message.`
    });

    return created(res, { message: "Message sent", data: { message: msg } });
  } catch (e) {
    next(e);
  }
}

async function markRead(req, res, next) {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      res.status(404);
      throw new Error("Conversation not found");
    }
    await requireConversationParticipant(res, req, conversation);
    await Message.updateMany({ conversationId: conversation._id, receiver: req.user._id, isRead: false }, { $set: { isRead: true } });
    return ok(res, { message: "Marked as read" });
  } catch (e) {
    next(e);
  }
}

async function solveConversation(req, res, next) {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      res.status(404);
      throw new Error("Conversation not found");
    }
    await requireConversationParticipant(res, req, conversation);

    const item = await Item.findById(conversation.itemId).populate("reportedBy", "_id name");
    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }

    const ownerId = String(item.reportedBy?._id || item.reportedBy);
    const me = String(req.user._id);
    const otherId = (conversation.participants || []).find((p) => String(p) !== me);

    if (me === ownerId) conversation.solvedByOwner = true;
    else conversation.solvedByFinder = true;

    await conversation.save();

    if (otherId) {
      await createNotification({
        userId: otherId,
        type: "info",
        title: "Problem solved confirmation",
        message: `${req.user.name} confirmed the problem is solved for: ${item.title}`
      });
    }

    if (conversation.solvedByOwner && conversation.solvedByFinder) {
      conversation.status = "solved";
      conversation.solvedAt = new Date();
      await conversation.save();

      // Some legacy items may not satisfy newer required fields; do not block solving on validation.
      await Item.updateOne(
        { _id: item._id },
        {
          $set: {
            status: "solved",
            solvedAt: new Date(),
            solvedConversationId: conversation._id
          }
        },
        { runValidators: false }
      );

      await createNotification({
        userId: ownerId,
        type: "info",
        title: "Report solved",
        message: `Both users confirmed. Your report is now marked solved: ${item.title}`
      });
      if (otherId) {
        await createNotification({
          userId: otherId,
          type: "info",
          title: "Report solved",
          message: `Both users confirmed. The report is now marked solved: ${item.title}`
        });
      }
    }

    return ok(res, { message: "Confirmation saved", data: { conversation } });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  startConversation,
  listConversations,
  getConversation,
  sendMessage,
  markRead,
  solveConversation
};
