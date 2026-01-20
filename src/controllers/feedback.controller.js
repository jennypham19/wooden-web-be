const catchAsync = require("../utils/catchAsync");
const feedbackService = require("../services/feedback.service");
const { StatusCodes } = require("http-status-codes");
const pick = require("../utils/pick");

const saveFeedbackDraft = catchAsync(async(req, res) => {
    await feedbackService.saveFeedbackDraft(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Lưu phản hồi khách hàng ở trạng thái lưu nháp thành công.'})
})

const saveFeedbackConfirmed = catchAsync(async(req, res) => {
    await feedbackService.saveFeedbackConfirmed(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Lưu phản hồi khách hàng ở trạng thái xác nhận phản hồi thành công.'})
})

const getListFeedbacks = catchAsync(async(req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'orderCode', 'rating', 'status']);
    const feedbacks = await feedbackService.queryListFeedbacks(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách phản hồi thành công.', data: feedbacks })
})

module.exports = {
    saveFeedbackDraft,
    getListFeedbacks,
    saveFeedbackConfirmed
}