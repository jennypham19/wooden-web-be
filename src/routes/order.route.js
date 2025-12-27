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

/* Update tiến độ và trạng thái của step, đồng thời lưu ảnh của từng step */
router.put(
    '/step-updated/:id',
    validate(orderValidation.updateStep),
    orderController.updateStep
)

/* Thêm mới step */
router.post(
    '/step-created',
    validate(orderValidation.createAddStep),
    orderController.createAddStep
)

router.patch(
    '/proccess-order-updated/:id',
    validate(orderValidation.updateProccessOrder),
    orderController.updateProccessOrder
)

// update order
router.put(
    '/order-updated/:id',
    validate(orderValidation.updateOrder),
    orderController.updateDateAndReason
)

/* Lấy danh sách đơn hàng có tiến độ là 75% để đánh giá */
router.get(
    '/orders-with-proccess',
    validate(orderValidation.queryOrdersWithProccess),
    orderController.queryOrdersWithProccess
)

/* ------------- Lấy danh sách đơn hàng theo id quản lý ------------- */
router.get('/list-orders-by-manager', validate(orderValidation.queryOrders), orderController.queryOrdersByIdManager)

/* Lấy danh sách đơn hàng có công việc được tạo bởi id quản lý */
router.get('/list-orders-with-work-by-manager', validate(orderValidation.queryOrders), orderController.queryOrdersWithWorkByIdManager)

module.exports = router;