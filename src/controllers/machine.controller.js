const catchAsync = require('../utils/catchAsync');
const machineService = require('../services/machine.service');
const pick = require('../utils/pick');
const { StatusCodes } = require('http-status-codes');

// Tạo máy móc
const createMachine = catchAsync(async(req, res) => {
    await machineService.createMachine(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo máy móc thành công' });
})

// Lấy danh sách máy móc
const queryListMachines = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit','searchTerm', 'status'])
    const machines = await machineService.queryListMachines(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách máy móc thành công. ', data: machines})
})

// Lấy chi tiết máy móc
const getMachineById = catchAsync(async(req, res) => {
    const machine = await machineService.getMachineById(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy bản ghi thành công.', data: machine })
})

// Cập nhật thông tin máy móc theo trạng thái
const updateMachineByStatus = catchAsync(async(req, res) => {
    await machineService.updateMachineByStatus(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật bản ghi thành công.'})
})

// Cập nhật ngày sửa xong và trạng thái máy móc khi đang ở trạng thái Đang sửa chữa
const updateMachineCompletionDate = catchAsync(async(req, res) => {
    await machineService.updateMachineCompletionDate(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật bản ghi thành công.'})
})

module.exports = {
    createMachine,
    queryListMachines,
    getMachineById,
    updateMachineByStatus,
    updateMachineCompletionDate
}