const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateTokens = (userId, role) => {
  const access = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const refresh = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { access, refresh };
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  try {
    const { name, phone, password, email } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ success: false, message: 'Name, phone and password required' });
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(phone)) return res.status(400).json({ success: false, message: 'Invalid Pakistani phone number' });
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) return res.status(409).json({ success: false, message: 'Phone already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const user = await prisma.user.create({
      data: { name, phone, email, passwordHash, otp, otpExpiry },
    });
    console.log(`OTP for ${phone}: ${otp}`); // In prod: send via SMS
    res.status(201).json({ success: true, message: 'OTP sent', userId: user.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    await prisma.user.update({ where: { id: userId }, data: { otp: null, otpExpiry: null } });
    const tokens = generateTokens(user.id, user.role);
    res.json({ success: true, tokens, user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ success: false, message: 'Phone and password required' });
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });
    const tokens = generateTokens(user.id, user.role);
    res.json({ success: true, tokens, user: { id: user.id, name: user.name, phone: user.phone, role: user.role, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required' });
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' });
    const tokens = generateTokens(user.id, user.role);
    res.json({ success: true, tokens });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

exports.me = async (req, res) => {
  const { passwordHash, otp, otpExpiry, ...user } = req.user;
  res.json({ success: true, user });
};
