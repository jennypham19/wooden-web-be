const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const designRequestValidation = require("../validations/design-request.validation");
const designRequestController = require('../controllers/design-request.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect);

// Lấy danh sách
router.get(
    '/list-design-requests',
    authorize('technical_design'),
    validate(designRequestValidation.queryDesignRequests),
    designRequestController.queryListDesignRequests
)

// Tạo mới yêu cầu
router.post(
    '/creation-bom',
    authorize('technical_design'),
    validate(designRequestValidation.createDesignRequest),
    designRequestController.createDesignRequest
)

// Lấy chi tiết
router.get(
    '/detail-design-request/:id',
    authorize('technical_design'),
    validate(designRequestValidation.queryDesignRequest),
    designRequestController.getDetailDesignRequets
)

// Cập nhật trạng thái và ngày hoàn thành
router.put(
    '/update-status-date/:id',
    authorize('technical_design'),
    validate(designRequestValidation.updateStatusAndDate),
    designRequestController.updateStatusAndDate
)

module.exports = router;