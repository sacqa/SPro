const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createNotification = async (userId, title, message, orderId = null) => {
  try {
    await prisma.notification.create({ data: { userId, title, message, orderId } });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};
