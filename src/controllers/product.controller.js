const catchAsync = require("../utils/catchAsync");
const productService = require("../services/product.service");
const { StatusCodes } = require("http-status-codes");
const pick = require("../utils/pick");

// Lấy danh sách sản phẩm theo đơn hàng
const queryProductsByOrderId = catchAsync(async(req, res) => {
    const orderId = req.params.id;
    const products = await productService.queryProductsByOrderId(orderId);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách sản phẩm thành công', data: products })
})

// Lấy danh sách sản phẩm theo đơn hàng và trạng thái
const queryProductsByOrderIdAndStatus = catchAsync(async(req, res) => {
    const orderId = req.params.id;
    const products = await productService.queryProductsByOrderIdAndStatus(orderId);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách sản phẩm thành công', data: products })
})

/* ------------- Lấy chi tiết mốc công việc đã được tạo theo sản phẩm + assign chính thợ mộc đó thông qua id ở role thợ mộc ------------ */
const getDetailWorkOrderByProduct = catchAsync(async(req, res) => {
    const productId = req.params.id;
    const workOrderByProduct = await productService.getDetailWorkOrderByProduct(productId);
    res.status(StatusCodes.OK).send({ success: true, message: "Lấy chi tiết bản ghi thành công. ", data: workOrderByProduct })
})

/* Update hình ảnh và trạng thái sản phẩm */
const updateImageAndStatusProduct = catchAsync(async(req, res) => {
    await productService.updateImageAndStatusProduct(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật bản ghi thành công.'})
})

/* Send request milestone */
const sendRequestMilestone = catchAsync(async(req, res) => {
    await productService.sendRequestMilestone(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: "Gửi yêu cầu làm lại thành công."})
})

/* Send evaluation milestone */
const sendEvaluationMilestone = catchAsync(async(req, res) => {
    await productService.sendEvaluationMilestone(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: "Gửi đánh giá thành công."})
})

/* Send evaluation work order */
const sendEvaluationWorkOrder = catchAsync(async(req, res) => {
    await productService.sendEvaluationWorkOrder(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: "Gửi đánh giá thành công."})
})

/* Evaluation product */
const evaluationProduct = catchAsync(async(req, res) => {
    await productService.evaluationProduct(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Đánh giá sản phẩm thành công.'})
})

/* Lấy thông tin đánh giá sản phẩm theo id sản phẩm đã được đánh giá */
const getDataProductReview = catchAsync(async(req, res) => {
    const productReview = await productService.getDataEvaluationProduct(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy bản ghi thành công', data: productReview })
})

// Lấy danh sách sản phẩm đã được hoàn thành
const getCompletedProducts = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const completedProducts = await productService.getCompletedProducts(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: completedProducts })
})

module.exports = {
    queryProductsByOrderId,
    queryProductsByOrderIdAndStatus,
    getDetailWorkOrderByProduct,
    updateImageAndStatusProduct,
    sendRequestMilestone,
    sendEvaluationMilestone,
    sendEvaluationWorkOrder,
    evaluationProduct,
    getDataProductReview,
    getCompletedProducts
}