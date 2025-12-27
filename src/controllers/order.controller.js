const catchAsync = require("../utils/catchAsync");
const orderService = require("../services/order.service");
const { StatusCodes } = require("http-status-codes");
const pick = require("../utils/pick");

/* ------------- Tạo đơn hàng -------------- */
const createOrder = catchAsync(async(req, res) => {
    await orderService.createOrder(req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Tạo đơn hàng thành công' })
})

/* ------------- Lấy danh sách đơn hàng ------------- */
const queryOrders = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm', 'status']);
    const orders = await orderService.queryOrders(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: orders })
})

/* ------------- Lấy chi tiết đơn hàng ------------ */
const getDetailOrder = catchAsync(async(req, res) => {
    const order = await orderService.getDetailOrder(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy chi tiết thông tin đơn hàng thành công.', data: order })
})

/* ------------- Tạo mới công việc ------------- */
const saveOrderWork = catchAsync(async(req, res) => {
    await orderService.saveOrderWork(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo công việc trong đơn hàng thành công '})
})

/* Lấy danh sách đơn hàng đã được tạo mốc công việc + assign chính thợ mộc đó thông qua id ở role thợ mộc */
const queryOrdersByCarpenterId = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm', 'status', 'id']);
    const ordersByCarpenterId = await orderService.queryOrdersByCarpenterId(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công. ', data: ordersByCarpenterId })
})

/* Update tiến độ và trạng thái của step, đồng thời lưu ảnh của từng step */
const updateStep = catchAsync(async(req, res) => {
    await orderService.updateStep(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật tiến độ thành công. '})
})

/* Thêm mới step */
const createAddStep = catchAsync(async(req, res) => {
    await orderService.createStep(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới bản ghi thành công. '})
})

const updateProccessOrder = catchAsync(async(req, res) => {
    await orderService.updateProccessOrder(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật bản ghi thành công. '})
})

/* Update order */
const updateDateAndReason = catchAsync(async(req, res) => {
    await orderService.updateOrder(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật bản ghi thành công.'})
})

/* Lấy danh sách đơn hàng có tiến độ là 75% để đánh giá */
const queryOrdersWithProccess = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm', 'isEvaluated']);
    const ordersWithProccess = await orderService.queryOrdersWithProccess(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: ordersWithProccess })
})

/* ------------- Lấy danh sách đơn hàng theo id quản lý ------------- */
const queryOrdersByIdManager = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm', 'status', 'id']);
    const orders = await orderService.queryOrdersByIdManager(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: orders })
})

/* Lấy danh sách đơn hàng có công việc được tạo bởi id quản lý */
const queryOrdersWithWorkByIdManager = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm', 'status', 'id']);
    const orders = await orderService.queryOrdersWithWorkByIdManager(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: orders })
})
module.exports = {
    createOrder,
    queryOrders,
    getDetailOrder,
    saveOrderWork,
    queryOrdersByCarpenterId,
    updateStep,
    createAddStep,
    updateProccessOrder,
    updateDateAndReason,
    queryOrdersWithProccess,
    queryOrdersByIdManager,
    queryOrdersWithWorkByIdManager
}