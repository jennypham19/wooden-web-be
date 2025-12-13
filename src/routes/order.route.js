const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const orderController = require('../controllers/order.controller');
const orderValidation = require('../validations/order.validation');
const baseValidation = require('../validations/base.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect, authorize('employee', 'technical_design', 'factory_manager', 'carpenter'))

router.post('/create-order', validate(orderValidation.createOrder), orderController.createOrder)

router.get('/get-list-orders', validate(orderValidation.queryOrders), orderController.queryOrders)

router
    .route('/detail-order/:id')
    .get(validate(baseValidation.queryOption), orderController.getDetailOrder)

module.exports = router;