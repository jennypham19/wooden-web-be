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

module.exports = {
    queryProductsByOrderId,
    queryProductsByOrderIdAndStatus,
    getDetailWorkOrderByProduct,
    updateImageAndStatusProduct,
    sendRequestMilestone
}