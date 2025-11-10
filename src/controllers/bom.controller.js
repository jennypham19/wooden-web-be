const catchAsync = require("../utils/catchAsync");
const bomService = require("../services/bom.service");
const { StatusCodes } = require("http-status-codes");
const pick = require("../utils/pick");

const createBom = catchAsync(async(req, res) => {
    await bomService.createBom(req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Tạo bom thành công' })
})

const getListBoms = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm'])
    const boms = await bomService.queryBoms(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: boms})
})

module.exports = {
    createBom,
    getListBoms
}