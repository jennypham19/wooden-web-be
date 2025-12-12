const catchAsync = require("../utils/catchAsync");
const orderService = require("../services/order.service");
const { StatusCodes } = require("http-status-codes");
const pick = require("../utils/pick");

const createOrder = catchAsync(async(req, res) => {
    await orderService.createOrder(req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Tạo đơn hàng thành công' })
})

const queryOrders = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm', 'status']);
    const orders = await orderService.queryOrders(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: orders })
})

const getDetailOrder = catchAsync(async(req, res) => {
    const order = await orderService.getDetailOrder(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy chi tiết thông tin đơn hàng thành công.', data: order })
})

module.exports = {
    createOrder,
    queryOrders,
    getDetailOrder
}