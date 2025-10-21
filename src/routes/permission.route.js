const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const permissionValidation = require('../validations/permission.validation');
const permissionController = require('../controllers/permission.controller');

const router = express.Router();

router.use(protect, authorize('admin'));

/* 1. Thao tác */
// Lấy danh sách
router
    .route('/actions')
    .get(validate(permissionValidation.getQuery), permissionController.getActions)
// Thêm mới
router
    .route('/create-action')
    .post(validate(permissionValidation.createAction), permissionController.createAction)
// Chỉnh sửa
router
    .route('/update-action/:id')
    .put(validate(permissionValidation.updateAction), permissionController.updateAction)

    /* 2. Chức năng */
// Tạo mới chức năng
router
    .route('/create-menu')
    .post(validate(permissionValidation.createMenu), permissionController.createMenu)

// Lây danh sách chức năng
router
    .route('/menus')
    .get(validate(permissionValidation.getQuery), permissionController.getMenus)

// Lây chi tiết chức năng
router
    .route('/menu/:id')
    .get(validate(permissionValidation.getId), permissionController.getMenu)

// Cập nhật chức năng
router
    .route('/update-menu/:id')
    .put(validate(permissionValidation.updateMenu), permissionController.updateMenu)

// Lấy danh sách chức năng kèm thao tác
router
    .route('/menu-with-action')
    .get(permissionController.getMenuWithAction)
/* 3. Nhóm quyền */

module.exports = router;