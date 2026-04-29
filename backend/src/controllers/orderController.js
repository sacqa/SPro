const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateWhatsAppMessage } = require('../utils/whatsapp');
const { createNotification } = require('../utils/notifications');

const generateOrderNumber = () => `SPD-${Date.now().toString().slice(-8)}`;

exports.createOrder = async (req, res) => {
  try {
    const { type, addressId, paymentMethod, notes, items, speedSendDetails, customDetails } = req.body;
    const userId = req.user.id;

    if (!type || !paymentMethod) return res.status(400).json({ success: false, message: 'Type and payment method required' });

    const pricing = await prisma.pricingRule.findMany();
    const deliveryFee = pricing.find(p => p.key === 'delivery_fee')?.value || 50;
    const serviceCharge = pricing.find(p => p.key === 'service_charge')?.value || 20;

    let totalAmount = 0;
    const orderItems = [];

    if (items && items.length > 0) {
      for (const item of items) {
        let price = item.price;
        if (item.productId) {
          const product = await prisma.product.findUnique({ where: { id: item.productId } });
          if (product) price = product.price;
        }
        totalAmount += price * item.quantity;
        orderItems.push({ name: item.name, quantity: item.quantity, price, productId: item.productId, image: item.image });
      }
    }

    const grandTotal = totalAmount + Number(deliveryFee) + Number(serviceCharge);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        addressId,
        type,
        paymentMethod,
        notes,
        totalAmount: grandTotal,
        deliveryFee,
        serviceCharge,
        items: { create: orderItems },
        statusLogs: { create: { status: 'SUBMITTED', note: 'Order placed by customer' } },
        speedSendDetails: speedSendDetails ? { create: speedSendDetails } : undefined,
        customDetails: customDetails ? { create: customDetails } : undefined,
      },
      include: { items: true, address: true, user: true, speedSendDetails: true, customDetails: true },
    });

    await createNotification(userId, 'Order Placed!', `Your order ${order.orderNumber} has been submitted.`, order.id);

    const waMessage = generateWhatsAppMessage(order);
    res.status(201).json({ success: true, order, whatsappUrl: `https://wa.me/923337339009?text=${encodeURIComponent(waMessage)}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true, address: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: true, address: true, statusLogs: { orderBy: { createdAt: 'asc' } }, speedSendDetails: true, customDetails: true, pharmacyDetails: true },
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadPaymentProof = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const order = await prisma.order.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Payment proof image required' });

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentProof: `/uploads/payment-proofs/${req.file.filename}`,
        transactionId,
        status: 'PAYMENT_UNDER_REVIEW',
        statusLogs: { create: { status: 'PAYMENT_UNDER_REVIEW', note: 'Payment proof uploaded' } },
      },
    });
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadPrescription = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Prescription image required' });

    await prisma.pharmacyDetails.upsert({
      where: { orderId: order.id },
      update: { prescriptionImage: `/uploads/order-images/${req.file.filename}` },
      create: { orderId: order.id, description: req.body.description || '', prescriptionImage: `/uploads/order-images/${req.file.filename}` },
    });
    res.json({ success: true, message: 'Prescription uploaded' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!['SUBMITTED', 'WAITING_FOR_ESTIMATE'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel order at this stage' });
    }
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELLED',
        statusLogs: { create: { status: 'CANCELLED', note: 'Cancelled by customer' } },
      },
    });
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
