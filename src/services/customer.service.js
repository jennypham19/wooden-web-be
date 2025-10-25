const { StatusCodes } = require('http-status-codes');
const { Customer } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');


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

module.exports = {
    createCustomer,
    queryListCustomers
}