const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service.js');
const pick = require('../utils/pick');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(StatusCodes.CREATED).send({ success: true, message: 'Tạo người dùng thành công', data: user });
})

// Lấy ra danh sách + search tài khoản
const getListAccounts = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'role', 'searchTerm']);
    const accounts = await userService.queryListAccounts(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: accounts})
})

// Lấy ra danh sách + search tài khoản phân quyền
const getListDecentralizeAccounts = catchAsync(async (req, res) => {
    const queryOptions = pick(req.query, ['page', 'limit', 'isPermission', 'searchTerm']);
    const accounts = await userService.queryListDecentralizedAccounts(queryOptions);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy danh sách thành công.', data: accounts})
})

// Lấy ra chi tiết tài khoản kèm quyền
const getDetailUserWithPermission = catchAsync(async (req, res) => {
    const user = await userService.getDetailUserWithPermission(req.params.id);
    res.status(StatusCodes.OK).send({ success: true, message: 'Lấy chi tiết bản ghi thành công', data: user })
})

module.exports = {
    createUser,
    getListAccounts,
    getListDecentralizeAccounts,
    getDetailUserWithPermission
}