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

module.exports = {
    queryProductsByOrderId,
}