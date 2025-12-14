//src/routes/post.route.js
const express = require('express');

const { protect, authorize } = require('../middlewares/auth');
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');
const baseValidation = require('../validations/base.validation');
const validate = require('../middlewares/validate');

const router = express.Router();

// lấy chi tiết kèm quyền
router.get(
    '/get-detail-account-with-permission/:id',
    validate(userValidation.getUser),
    userController.getDetailUserWithPermission
)

// lấy danh sách
router.get(
    '/get-list-accounts',
    validate(userValidation.getQuery),
    userController.getListAccounts
)

router.use(protect, authorize('admin', 'factory_manager'));

// tạo 
router.post(
    '/create-user',
    validate(userValidation.createUser),
    userController.createUser
)

// lấy danh sách
router.get(
    '/get-list-decentralized-accounts',
    validate(userValidation.getQueryDecentralized),
    userController.getListDecentralizeAccounts
)

// lấy danh sách thợ mộc
router.get(
    '/list-carpenters',
    validate(baseValidation.queryOptions),
    userController.getListUserWithRoleCarpenter
)



module.exports = router;