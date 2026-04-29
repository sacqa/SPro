const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
  const { passwordHash, otp, otpExpiry, ...user } = req.user;
  res.json({ success: true, user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (req.file) data.avatar = `/uploads/avatars/${req.file.filename}`;
    const user = await prisma.user.update({ where: { id: req.user.id }, data });
    const { passwordHash, otp, otpExpiry, ...userClean } = user;
    res.json({ success: true, user: userClean });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({ where: { userId: req.user.id } });
    res.json({ success: true, addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { label, street, area, city, isDefault } = req.body;
    if (isDefault) await prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    const address = await prisma.address.create({ data: { userId: req.user.id, label, street, area, city, isDefault: !!isDefault } });
    res.status(201).json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { isDefault, ...data } = req.body;
    if (isDefault) await prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    const address = await prisma.address.update({ where: { id: req.params.id }, data: { ...data, isDefault: !!isDefault } });
    res.json({ success: true, address });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    await prisma.address.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
