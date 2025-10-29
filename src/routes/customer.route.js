const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const customerController = require('../controllers/customer.controller');
const customerValidation = require('../validations/customer.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect, authorize('employee'));

// Tạo mới khách hàng
router
    .route('/create-customer')
    .post(validate(customerValidation.createCustomer), customerController.createCustomer)

// Lấy ra danh sách
router
    .route('/get-list-customers')
    .get(validate(customerValidation.queryCustomers), customerController.queryListCustomers)

// Chỉnh sửa khách hàng
router
    .route('/update-customer/:id')
    .put(validate(customerValidation.updateCustomer), customerController.updateCustomer)

// Xóa khách hàng
router
    .route('/delete-customer/:id')
    .delete(validate(customerValidation.queryCustomer), customerController.deleteCustomer)
module.exports = router;