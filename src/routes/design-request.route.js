const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const designRequestValidation = require("../validations/design-request.validation");
const designRequestController = require('../controllers/design-request.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect, authorize('employee', 'technical_design', 'factory_manager', 'production_supervisor'))

// Lấy danh sách
router.get(
    '/list-design-requests',
    validate(designRequestValidation.queryDesignRequests),
    designRequestController.queryListDesignRequests
)

// Tạo mới yêu cầu
router.post(
    '/creation-bom',
    validate(designRequestValidation.createDesignRequest),
    designRequestController.createDesignRequest
)

// Lấy chi tiết
router.get(
    '/detail-design-request/:id',
    validate(designRequestValidation.queryDesignRequest),
    designRequestController.getDetailDesignRequets
)

// Cập nhật trạng thái và ngày hoàn thành
router.put(
    '/update-status-date/:id',
    validate(designRequestValidation.updateStatusAndDate),
    designRequestController.updateStatusAndDate
)

module.exports = router;