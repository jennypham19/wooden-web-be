const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const orderController = require('../controllers/order.controller');
const orderValidation = require('../validations/order.validation');
const baseValidation = require('../validations/base.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect, authorize('employee', 'technical_design', 'factory_manager', 'carpenter'))

/* ------------- Tạo đơn hàng -------------- */
router.post('/create-order', validate(orderValidation.createOrder), orderController.createOrder)

/* ------------- Lấy danh sách đơn hàng ------------- */
router.get('/get-list-orders', validate(orderValidation.queryOrders), orderController.queryOrders)

/* ------------- Lấy chi tiết đơn hàng ------------ */
router
    .route('/detail-order/:id')
    .get(validate(baseValidation.queryOption), orderController.getDetailOrder)

/* ------------- Tạo mới công việc ------------- */
router.post(
    '/save-work-order',
    validate(orderValidation.createOrderWork),
    orderController.saveOrderWork
)

/* Lấy danh sách đơn hàng đã được tạo mốc công việc + assign chính thợ mộc đó thông qua id ở role thợ mộc */
router.get(
    '/list-orders-by-carpenter',
    validate(orderValidation.queryOrdersByCarpenterId),
    orderController.queryOrdersByCarpenterId
)

module.exports = router;