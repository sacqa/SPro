const router = require('express').Router();
const c = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');
router.use(authenticate);
router.get('/', c.getNotifications);
router.post('/read-all', c.markRead);
module.exports = router;
