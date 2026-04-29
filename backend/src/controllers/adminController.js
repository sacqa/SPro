const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('../utils/notifications');

exports.getDashboard = async (req, res) => {
  try {
    const [totalOrders, pendingOrders, customers, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: { not: 'DELIVERED' } } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.aggregate({ where: { status: 'DELIVERED' }, _sum: { totalAmount: true } }),
    ]);
    const recentOrders = await prisma.order.findMany({
      take: 10, orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, phone: true } }, items: true },
    });
    res.json({ success: true, stats: { totalOrders, pendingOrders, customers, revenue: revenue._sum.totalAmount || 0 }, recentOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip: (page - 1) * limit, take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, phone: true } }, items: true, address: true },
      }),
      prisma.order.count({ where }),
    ]);
    res.json({ success: true, orders, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { user: true, items: true, address: true, statusLogs: { orderBy: { createdAt: 'asc' } }, speedSendDetails: true, customDetails: true, pharmacyDetails: true },
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, riderName, riderPhone, riderVehicle } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status, riderName, riderPhone, riderVehicle,
        statusLogs: { create: { status, note: note || `Status updated to ${status}` } },
      },
      include: { user: true },
    });
    await createNotification(order.userId, `Order ${status.replace(/_/g, ' ')}`, `Order ${order.orderNumber}: ${note || status}`, order.id);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approvePayment = async (req, res) => {
  try {
    const { approved, note } = req.body;
    const newStatus = approved ? 'PAYMENT_VERIFIED' : 'AWAITING_PAYMENT';
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status: newStatus,
        paymentNote: note,
        statusLogs: { create: { status: newStatus, note: note || (approved ? 'Payment verified' : 'Payment rejected') } },
      },
      include: { user: true },
    });
    await createNotification(order.userId, approved ? 'Payment Verified!' : 'Payment Rejected', note || (approved ? 'Your payment has been verified.' : 'Payment proof rejected, please re-upload.'), order.id);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, unit, categoryId, stock, isFeatured } = req.body;
    const image = req.file ? `/uploads/order-images/${req.file.filename}` : null;
    const product = await prisma.product.create({ data: { name, description, price: parseFloat(price), unit, categoryId, stock: parseInt(stock) || 100, isFeatured: isFeatured === 'true', image } });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.price) data.price = parseFloat(data.price);
    if (data.stock) data.stock = parseInt(data.stock);
    if (req.file) data.image = `/uploads/order-images/${req.file.filename}`;
    const product = await prisma.product.update({ where: { id: req.params.id }, data });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, icon, sortOrder } = req.body;
    const image = req.file ? `/uploads/banners/${req.file.filename}` : null;
    const cat = await prisma.category.create({ data: { name, slug, icon, image, sortOrder: parseInt(sortOrder) || 0 } });
    res.status(201).json({ success: true, category: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const { title, link, sortOrder } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Banner image required' });
    const banner = await prisma.banner.create({ data: { title, link, image: `/uploads/banners/${req.file.filename}`, sortOrder: parseInt(sortOrder) || 0 } });
    res.status(201).json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/banners/${req.file.filename}`;
    const banner = await prisma.banner.update({ where: { id: req.params.id }, data });
    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    await prisma.banner.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: { id: true, name: true, phone: true, email: true, isActive: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPricingRules = async (req, res) => {
  try {
    const rules = await prisma.pricingRule.findMany();
    res.json({ success: true, rules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePricingRule = async (req, res) => {
  try {
    const { value } = req.body;
    const rule = await prisma.pricingRule.update({ where: { id: req.params.id }, data: { value: parseFloat(value) } });
    res.json({ success: true, rule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [byType, byStatus] = await Promise.all([
      prisma.order.groupBy({ by: ['type'], _count: true }),
      prisma.order.groupBy({ by: ['status'], _count: true }),
    ]);
    res.json({ success: true, byType, byStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
