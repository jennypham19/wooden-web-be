const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const productController = require('../controllers/product.controller');
const productValidation = require('../validations/product.validation');
const baseValidation = require('../validations/base.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect);
// Lấy danh sách sản phẩm theo đơn hàng
router.get(
    '/get-products-by-order/:id',
    authorize('technical_design', 'factory_manager', 'carpenter', 'employee'),
    validate(productValidation.queryProducts),
    productController.queryProductsByOrderId
)

// Lấy danh sách sản phẩm theo đơn hàng và trạng thái
router.get(
    '/products-by-order-and-status/:id',
    authorize('technical_design', 'factory_manager'),
    validate(productValidation.queryProducts),
    productController.queryProductsByOrderIdAndStatus
)

/* ------------- Lấy chi tiết mốc công việc đã được tạo theo sản phẩm + assign chính thợ mộc đó thông qua id ở role thợ mộc ------------ */
router.get(
    '/detail-work-order-by-product/:id',
    validate(baseValidation.queryOption),
    productController.getDetailWorkOrderByProduct
)

/* Update hình ảnh và trạng thái sản phẩm */
router.put(
    '/image-and-status-product-updated/:id',
    validate(productValidation.updateImageAndStatusProduct),
    productController.updateImageAndStatusProduct
)

/* Send request milestone */
router.put(
    '/request-milestone-sent/:id',
    validate(productValidation.sendRequestMilestone),
    productController.sendRequestMilestone
)

module.exports = router;