const { StatusCodes } = require('http-status-codes');
const { Customer } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

// Lấy chi tiết khách hàng
const getCustomerById = async(id) => {
    const customer = await Customer.findByPk(id);
    if(!customer){
        throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy khách hàng này.")
    }
    return customer;
}

// Thêm mới khách hàng
const createCustomer = async (custormerBody) => {
    try {
        const { name, phone, address } = custormerBody;
        await Customer.create({ name, phone, address })
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Lấy danh sách khách hàng
const queryListCustomers = async (queryOptions) => {
    try {
        const { page, limit, searchTerm } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = {};
        if(searchTerm) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${searchTerm}%` }},
                { phone: { [Op.iLike]: `%${searchTerm}%` }},
                { address: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        }
        const { count, rows: customersDB } = await Customer.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[ 'createdAt', 'DESC']]
        });
        const totalPages = Math.ceil(count/limit);
        const customers = customersDB.map((customer) => {
            const newCustomer = customer.toJSON();
            return {
                id: newCustomer.id,
                name: newCustomer.name,
                phone: newCustomer.phone,
                address: newCustomer.address,
                amountOfOrders: newCustomer.amount_of_orders,
                createdAt: newCustomer.createdAt,
                updatedAt: newCustomer.updatedAt
            }
        })
        return {
            data: customers,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi xảy ra: ' + error.message)
    }
}

// Chỉnh sửa khách hàng
const updateCustomer = async (id, custormerBody) => {
    try {
        const { name, phone, address } = custormerBody;
        const customer = await getCustomerById(id);
        customer.name = name;
        customer.phone = phone;
        customer.address = address;
        customer.save();
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Xóa khách hàng
const deleteCustomer = async(id) => {
    try {
        // Nếu tồn tại đơn hàng được gắn với khách hàng 
        const customer = await getCustomerById(id);

        // Nếu không có thì được xóa;
        await Customer.destroy({ where: { id }})
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message);
    }
}

module.exports = {
    createCustomer,
    queryListCustomers,
    updateCustomer,
    deleteCustomer
}