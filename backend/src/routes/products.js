const router = require('express').Router();
const c = require('../controllers/productController');
router.get('/', c.getProducts);
router.get('/:id', c.getProduct);
module.exports = router;
