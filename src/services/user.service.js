const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const { User, UserMenu, UserAction, Menu, MenuAction } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op, where } = require('sequelize');

// Lấy chi tiết user theo id
const getUserById = async(id) => {
    const user = await User.findByPk(id);
    if(!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tồn tại người dùng. ');
    };
    return user;
}

// Kiểm tra xem có tồn tại email không
const isEmailTaken = async (email) => {
    const user = await User.findOne({ where: { email}});
    return !!user;
}

// Tạo tài khoản
const createUser = async(userBody) => {
    const { fullName, dob, role, code, email, password, gender, phone, work, department, address, avatarUrl, nameImage } = userBody;
    try {
        if(await isEmailTaken(email)){
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Email đã tồn tại.');
        }
        // Hash bằng bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            full_name: fullName, dob, role, code, email, password: hashedPassword, gender, phone, work, department, address, avatar_url: avatarUrl, name_image: nameImage, is_active: true, is_reset: false
        })
        user.password = undefined; // Không trả về password
        return user;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Lấy ra danh sách + search tài khoản
const queryListAccounts = async(queryOptions) => {
    try {
        const { page, limit, searchTerm, role } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = {};
        if(role && role !== 'all'){
            whereClause.role = role;
        }
        if(searchTerm){
            whereClause[Op.or] = [
                { full_name: { [Op.iLike]: `%${searchTerm}%` }},
                { email: { [Op.iLike]: `%${searchTerm}%` }},
                { dob: { [Op.iLike]: `%${searchTerm}%` }},
                { code: { [Op.iLike]: `%${searchTerm}%` }},
                { phone: { [Op.iLike]: `%${searchTerm}%` }},
                { department: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        };

        const { count, rows: accountsDB } = await User.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[ 'createdAt', 'DESC']]
        })
        const totalPages = Math.ceil(count/limit);
        const accounts = accountsDB.map((account) => {
            const newAccount = account.toJSON();
            return {
                id: newAccount.id,
                email: newAccount.email,
                fullName: newAccount.full_name,
                role: newAccount.role,
                dob: newAccount.dob,
                code: newAccount.code,
                gender: newAccount.gender,
                phone: newAccount.phone,
                work: newAccount.work,
                department: newAccount.department,
                address: newAccount.address,
                avatarUrl: newAccount.avatar_url,
                nameImage: newAccount.name_image,
                isActive: newAccount.is_active,
                isReset: newAccount.is_reset,
                createdAt: newAccount.createdAt,
                updatedAt: newAccount.updatedAt,
            }
        })
        return {
            data: accounts,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi khi lấy ra danh sách: ' + error.message);
    }
}

// Lấy danh sách người dùng có role = carpenter
const queryListUser = async(queryOptions) => {
    try {
        const { page, limit } = queryOptions;
        const offset = (page - 1) * limit;

        const { count, rows: carpentersDB} = await User.findAndCountAll({
            where: { 
                role: 'carpenter',
                is_assigned: false
            },
            limit,
            offset,
            order: [[ 'createdAt', 'DESC']]
        })
        const totalPages = Math.ceil(count/limit);
        const carpenters = carpentersDB.map((account) => {
            const newAccount = account.toJSON();
            return {
                id: newAccount.id,
                email: newAccount.email,
                fullName: newAccount.full_name,
                role: newAccount.role,
                dob: newAccount.dob,
                code: newAccount.code,
                gender: newAccount.gender,
                phone: newAccount.phone,
                work: newAccount.work,
                department: newAccount.department,
                address: newAccount.address,
                avatarUrl: newAccount.avatar_url,
                nameImage: newAccount.name_image,
                isActive: newAccount.is_active,
                isReset: newAccount.is_reset,
                createdAt: newAccount.createdAt,
                updatedAt: newAccount.updatedAt,
            }
        })
        return {
            data: carpenters,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}


// Lấy list tài khoản đã được phân quyền và chưa phân quyền
const queryListDecentralizedAccounts = async(queryOptions) => {
    try {
        const { page, limit, searchTerm, isPermission } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = {};
  // ✅ Kiểm tra isPermission có giá trị true hoặc false (không undefined/null)
        if (isPermission !== undefined && isPermission !== null) {
            whereClause.is_permission = isPermission;
        }
        if(searchTerm){
            whereClause[Op.or] = [
                { full_name: { [Op.iLike]: `%${searchTerm}%` }},
                { email: { [Op.iLike]: `%${searchTerm}%` }},
                { dob: { [Op.iLike]: `%${searchTerm}%` }},
                { code: { [Op.iLike]: `%${searchTerm}%` }},
                { phone: { [Op.iLike]: `%${searchTerm}%` }},
                { department: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        };

        const { count, rows: accountsDB } = await User.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[ 'createdAt', 'DESC']]
        })
        const totalPages = Math.ceil(count/limit);
        const accounts = accountsDB.map((account) => {
            const newAccount = account.toJSON();
            return {
                id: newAccount.id,
                email: newAccount.email,
                fullName: newAccount.full_name,
                role: newAccount.role,
                dob: newAccount.dob,
                code: newAccount.code,
                gender: newAccount.gender,
                phone: newAccount.phone,
                work: newAccount.work,
                department: newAccount.department,
                address: newAccount.address,
                avatarUrl: newAccount.avatar_url,
                nameImage: newAccount.name_image,
                isActive: newAccount.is_active,
                isReset: newAccount.is_reset,
                createdAt: newAccount.createdAt,
                updatedAt: newAccount.updatedAt,
                isPermission: newAccount.is_permission
            }
        })
        return {
            data: accounts,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi khi lấy ra danh sách: ' + error.message);
    }
}

const mapPermissionByTree = (userRole) => {
        const user = userRole.toJSON(); // ép về object thường;
        const menus = user.userMenu.map((um) => {
            const m = { ...um.menu };
            if(m.parent_code === null) m.parent_code = '';
            return m
        });

        const actions = user.userAction.map((ua) => ua.menuAction);

        // Gom action theo menu_id
        const actionByMenu = {};
        actions.forEach((act) => {
            if(!actionByMenu[act.menu_id]) actionByMenu[act.menu_id] = [];
            actionByMenu[act.menu_id].push(act);
        })
        // Đệ quy build menu trên
        const mapMenu = (menuList, parentCode = '') => {
            return menuList
                .filter((m) => m.parent_code === parentCode)
                .map((menu) => {
                    const node = {
                        id: menu.id,
                        code: menu.code,
                        name: menu.name,
                        path: menu.path,
                        icon: menu.icon
                    };
                    const menuActions = (actionByMenu[menu.id] || []).map((act) => ({
                        id: act.id,
                        code: act.code,
                        name: act.name
                    }));
                    if(menuActions.length > 0) {
                        node.actions = menuActions;
                    }
                    const children = mapMenu(menuList, menu.code);
                    
                    if(children.length > 0) {
                        node.children = children.sort((a, b) => a.code.localeCompare(b.code));
                    };

                    return node;
                })
                // sắp xếp cấp hiện tại theo code
                .sort((a, b) => a.code.localeCompare(b.code))
        };

        return {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            dob: user.dob,
            code: user.code,
            gender: user.gender,
            phone: user.phone,
            work: user.work,
            department: user.department,
            address: user.address,
            avatarUrl: user.avatar_url,
            nameImage: user.name_image,
            isActive: user.is_active,
            isReset: user.is_reset,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isPermisison: user.is_permission,
            permissions: mapMenu(menus)
        }
}

// Lấy chi tiết tài khoản kèm quyền
const getDetailUserWithPermission = async (id) => {
    try {
        const userDB = await User.findOne({
            where: { id },
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
        });
        if(!userDB) throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi. ");
        return await mapPermissionByTree(userDB);
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message);
    }
}

module.exports = {
    createUser,
    queryListAccounts,
    queryListDecentralizedAccounts,
    getUserById,
    getDetailUserWithPermission,
    mapPermissionByTree,
    queryListUser
}