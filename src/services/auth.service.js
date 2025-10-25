const { User, Token, UserMenu, Menu, UserAction, MenuAction } = require('../models');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const userService = require('../services/user.service');

// Đăng nhập
const loginWithEmailAndPassword = async (email, password) => {
    try {
        const userDB = await User.findOne({ 
            where: { email }
        });
        if(!userDB || !(await bcrypt.compare(password, userDB.password))) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không chính xác');
        }
        if(!userDB.is_active) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên');
        }
        const userRoleDB = await User.findOne({
            where: { id: userDB.id },
            include: [
                {
                    model: UserMenu,
                    as: 'userMenu',
                    include: [
                        {
                            model: Menu,
                            as: 'menu',
                            order: [['userMenu', 'menu', 'code', 'ASC']]
                        }
                    ]
                },
                {
                    model: UserAction,
                    as: 'userAction',
                    include: [
                        { model: MenuAction, as: 'menuAction'}
                    ]
                }
            ]
        })
        const user = await userService.mapPermissionByTree(userRoleDB)
        return user;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Server error during login process. ' + error.message);
    }
}

// Đăng xuất
const logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ where: { token: refreshToken, type: 'refresh'}});
    if(!refreshTokenDoc) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Refresh token không tồn tại');
    }

    await refreshTokenDoc.destroy();
}

// Lấy thông tin cá nhân
const getCurrentMe = async(id) => {
    try {
        const userDB = await User.findByPk(id, { attributes: { exclude: ['password'] }});
        if(!userDB) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại');
        }
        const newUser = userDB.toJSON();
        const user = {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.full_name,
            address: newUser.address,
            avatarUrl: newUser.avatar_url,
            code: newUser.code,
            createdAt: newUser.createdAt,
            department: newUser.department,
            dob: newUser.dob,
            gender: newUser.gender,
            nameImage: newUser.name_image,
            isActive: newUser.is_active,
            isReset: newUser.is_reset,
            phone: newUser.phone,
            role: newUser.role,
            updatedAt: newUser.updatedAt,
            work: newUser.work,
            isPermission: newUser.is_permission
        }
        return user;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

module.exports = {
    loginWithEmailAndPassword,
    logout,
    getCurrentMe
}