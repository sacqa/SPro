// banners.js
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
router.get('/', async (req, res) => {
  const banners = await prisma.banner.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  res.json({ success: true, banners });
});
module.exports = router;
