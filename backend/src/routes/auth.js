// auth.js
const router = require('express').Router();
const c = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
router.post('/register', c.register);
router.post('/verify-otp', c.verifyOtp);
router.post('/login', c.login);
router.post('/refresh-token', c.refreshToken);
router.get('/me', authenticate, c.me);
module.exports = router;
