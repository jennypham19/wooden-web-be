const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const bomController = require('../controllers/bom.controller');
const bomValidation = require('../validations/bom.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

router.use(protect, authorize('employee', 'technical_design', 'factory_manager', 'production_supervisor'))

// Lưu bom
router.post(
    '/create-bom',
    validate(bomValidation.createBom),
    bomController.createBom
)

// Lấy danh sách
router.get(
    '/get-list-boms',
    validate(bomValidation.queryBoms),
    bomController.getListBoms
)

module.exports = router;