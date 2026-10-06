const Notification = require('../models/Notification');

/**
 * Send notification to a specific user
 */
const sendNotification = async ({
  recipient,
  type = 'SYSTEM',
  title,
  message,
  relatedId = '',
  actionUrl = '',
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      relatedId,
      actionUrl,
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }
};

/**
 * Send notification to multiple users
 */
const sendBulkNotifications = async (recipients = [], payload) => {
  try {
    const notifications = recipients.map((userId) => ({
      recipient: userId,
      type: payload.type || 'SYSTEM',
      title: payload.title,
      message: payload.message,
      relatedId: payload.relatedId || '',
      actionUrl: payload.actionUrl || '',
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error('Failed to send bulk notifications:', error.message);
  }
};

module.exports = {
  sendNotification,
  sendBulkNotifications,
};
