const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const productController = require('../controllers/product.controller');
const productValidation = require('../validations/product.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect);
// Lấy danh sách sản phẩm theo đơn hàng
router.get(
    '/get-products-by-order/:id',
    authorize('technical_design'),
    validate(productValidation.queryProducts),
    productController.queryProductsByOrderId
)

module.exports = router;