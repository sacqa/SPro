exports.generateWhatsAppMessage = (order) => {
  const itemsList = order.items?.map(i => `  - ${i.name} x${i.quantity} @ Rs.${i.price}`).join('\n') || 'No items';
  const address = order.address ? `${order.address.street}, ${order.address.area}, ${order.address.city}` : 'Not provided';

  return `🛵 *SPEEDO ORDER*
━━━━━━━━━━━━━━━
📦 Order #: *${order.orderNumber}*
🏷️ Type: *${order.type}*
👤 Customer: *${order.user?.name}*
📱 Phone: *${order.user?.phone}*
━━━━━━━━━━━━━━━
📋 *Items:*
${itemsList}
━━━━━━━━━━━━━━━
📍 Delivery Address: ${address}
💳 Payment Method: ${order.paymentMethod}
💰 Delivery Fee: Rs.${order.deliveryFee || 50}
🔧 Service Charge: Rs.${order.serviceCharge || 20}
💵 Total: Rs.${order.totalAmount || 'TBD'}
━━━━━━━━━━━━━━━
📝 Notes: ${order.notes || 'None'}
⏰ Placed at: ${new Date().toLocaleString('en-PK')}`;
};
