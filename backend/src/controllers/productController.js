// productsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProducts = async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 12 } = req.query;
    const where = { isActive: true };
    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (featured === 'true') where.isFeatured = true;
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip: (page - 1) * Number(limit), take: Number(limit), include: { category: true }, orderBy: { createdAt: 'desc' } }),
      prisma.product.count({ where }),
    ]);
    res.json({ success: true, products, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { category: true } });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
