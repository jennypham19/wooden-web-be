const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const permissionService = require('../services/permission.service');
const pick = require('../utils/pick');
/* 1. Thao tác */
// Thêm mới thao tác
const createAction = catchAsync(async (req, res) => {
  const action = await permissionService.createAction(req.body);
  res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới thao tác thành công.', data: action });
});
// Chỉnh sửa thao tác
const updateAction = catchAsync(async (req, res) => {
    const action = await permissionService.updateAction(req.params.id, req.body);
    res.status(StatusCodes.OK).send({ success: true, message: 'Cập nhập thành công', data: action})
})
// Lấy ra danh sách thao tác
const getActions = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const actions = await permissionService.getActions(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: actions})
})
/* 1. Chức năng */
// Thêm mới chức năng
const createMenu = catchAsync(async (req, res) => {
    const menu = await permissionService.createMenu(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Thêm mới chức năng thành công', data: menu})
})

//Lấy danh sách chức năng
const getMenus = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'searchTerm']);
    const menus = await permissionService.getMenus(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: menus})
})

//Lấy chi tiết 1 bản ghi chức năng
const getMenu = catchAsync(async (req, res) => {
    const menu = await permissionService.getMenuById(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy bản ghi thành công', data: menu})
})

// Chỉnh sửa chức năng
const updateMenu = catchAsync(async (req, res) => {
    const menu = await permissionService.updateMenu(req.params.id, req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Chỉnh sửa chức năng thành công', data: menu})
})

// Lấy danh sách chức năng kèm thao tác
const getMenuWithAction = catchAsync(async (req, res) => {
    const modules = await permissionService.getMenuWithAction();
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công', data: modules})
})
/* 1. Thao tác */

module.exports = {
    createAction,
    updateAction,
    getActions,
    createMenu,
    getMenus,
    getMenu,
    updateMenu,
    getMenuWithAction
}