const customerService = require('../services/customer.service');
const pick = require('../utils/pick');
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');

const createCustomer = catchAsync(async (req, res) => {
    await customerService.createCustomer(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới khách hàng thành công.'})
})

const queryListCustomers = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const customers = await customerService.queryListCustomers(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: customers})
})

// Chỉnh sửa khách hàng
const updateCustomer = catchAsync(async (req, res) => {
    await customerService.updateCustomer(req.params.id, req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Chỉnh sửa khách hàng thành công.'})
})

// Xóa khách hàng
const deleteCustomer = catchAsync(async (req, res) => {
    await customerService.deleteCustomer(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Xóa khách hàng thành công.'})
})
module.exports = {
    createCustomer,
    queryListCustomers,
    updateCustomer,
    deleteCustomer
}