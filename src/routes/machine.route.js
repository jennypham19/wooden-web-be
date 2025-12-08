const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const machineValidation = require('../validations/machine.validation');
const machineController = require('../controllers/machine.controller')

const router = express.Router();

router.use(protect);

// Lưu máy móc
router.post(
    '/machine-created',
    authorize('employee'),
    validate(machineValidation.createMachine),
    machineController.createMachine
)

// Danh sách máy móc
router.get(
    '/list-machines',
    authorize('employee'),
    validate(machineValidation.queryMachines),
    machineController.queryListMachines
)

// Lấy chi tiết bản ghi
router.get(
    '/detail-machine/:id',
    authorize('employee'),
    validate(machineValidation.queryMachine),
    machineController.getMachineById
)

// Cập nhật máy móc theo trạng thái
router.put(
    '/machine-updated-by-status/:id',
    authorize('employee'),
    validate(machineValidation.updateMachineByStatus),
    machineController.updateMachineByStatus
)

// Cập nhật ngày sửa xong và trạng thái máy móc khi đang ở trạng thái Đang sửa chữa
router.put(
    '/repaired-date-updated/:id',
    authorize('employee'),
    validate(machineValidation.updateMachineCompletionDate),
    machineController.updateMachineCompletionDate
)

module.exports = router;