const Notification = require("../models/Notification");

async function createNotification({ userId, title, message, type = "info" }) {
  return Notification.create({ userId, title, message, type });
}

module.exports = { createNotification };

