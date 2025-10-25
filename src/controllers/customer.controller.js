const customerService = require('../services/customer.service');
const pick = require('../utils/pick');
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');

const createCustomer = catchAsync(async (req, res) => {
    await customerService.createCustomer(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới tài khoản thành công.'})
})

const queryListCustomers = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const customers = await customerService.queryListCustomers(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: customers})
})

module.exports = {
    createCustomer,
    queryListCustomers
}