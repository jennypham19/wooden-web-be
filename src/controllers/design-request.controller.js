const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const designRequestService = require("../services/design-request.service");
const { StatusCodes } = require("http-status-codes");

// Lấy danh sách yêu cầu thiết kế
const queryListDesignRequests = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const designRequests = await designRequestService.queryListDesignRequest(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: designRequests })
})

// Tạo mới yêu cầu
const createDesignRequest = catchAsync(async(req, res) => {
    await designRequestService.createDesignRequest(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo mới yêu cầu thành công.'});
})

// Lấy chi tiết
const getDetailDesignRequets = catchAsync(async(req, res) => {
    const designRequest = await designRequestService.getDetailDesignRequets(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy bản ghi thành công', data: designRequest})
})

// Cập nhật trạng thái và ngày hoàn thành
const updateStatusAndDate = catchAsync(async(req, res) => {
    await designRequestService.updateStatusAndDate(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhật bản ghi thành công.'})
})

module.exports = {
    queryListDesignRequests,
    createDesignRequest,
    getDetailDesignRequets,
    updateStatusAndDate
}