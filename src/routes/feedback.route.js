const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const router = express.Router();
const feedbackValidation = require('../validations/feedback.validation');
const feedbackController = require('../controllers/feedback.controller')

router.use(protect, validate('employee'));

router.post(
    '/feedback-draft-save',
    validate(feedbackValidation.saveFeedbackDraft),
    feedbackController.saveFeedbackDraft
)

router.post(
    '/feedback-confirmed-save',
    validate(feedbackValidation.saveFeedbackConfirmed),
    feedbackController.saveFeedbackConfirmed
)

router.get(
    '/list-feedbacks',
    validate(feedbackValidation.queryFeedbacks),
    feedbackController.getListFeedbacks
)
module.exports = router;