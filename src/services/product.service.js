const { StatusCodes } = require('http-status-codes');
const { Product, Order, User, WorkMilestone, Worker, WorkOrder, Step } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

// Lấy danh sách sản phẩm theo id đơn hàng
const queryProductsByOrderId = async(orderId) => {
    try {
        const order = await Order.findByPk(orderId);
        if(!order){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại đơn hàng");
        }
        const productsDB = await Product.findAll({
            where: { order_id: orderId },
            include: [{ model: User, as: 'productsUser' }]
        });
        const products = productsDB.map((product) => {
            const newProduct = product.toJSON();
            return{
                id: newProduct.id,
                name: newProduct.name,
                description: newProduct.description,
                target: newProduct.target,
                proccess: newProduct.proccess,
                status: newProduct.status,
                manager: {
                    fullName: newProduct.productsUser.full_name,
                    role: newProduct.productsUser.role,
                    phone: newProduct.productsUser.phone
                },
                isCreated: newProduct.is_created,
                createdAt: newProduct.createdAt,
                updatedAt: newProduct.updatedAt
            }
        });
        return products;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Lấy danh sách sản phẩm theo id đơn hàng và trạng thái 
const queryProductsByOrderIdAndStatus = async(orderId) => {
    try {
        const order = await Order.findByPk(orderId);
        if(!order){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại đơn hàng");
        }
        const productsDB = await Product.findAll({
            where: { order_id: orderId, is_created: false },
            include: [{ model: User, as: 'productsUser' }]
        });
        const products = productsDB.map((product) => {
            const newProduct = product.toJSON();
            return{
                id: newProduct.id,
                name: newProduct.name,
                description: newProduct.description,
                target: newProduct.target,
                proccess: newProduct.proccess,
                status: newProduct.status,
                manager: {
                    fullName: newProduct.productsUser.full_name,
                    role: newProduct.productsUser.role,
                    phone: newProduct.productsUser.phone
                },
                isCreated: newProduct.is_created,
                createdAt: newProduct.createdAt,
                updatedAt: newProduct.updatedAt
            }
        });
        return products;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

/* ------------- Lấy chi tiết mốc công việc đã được tạo theo sản phẩm + assign chính thợ mộc đó thông qua id ở role thợ mộc ------------ */
const getDetailWorkOrderByProduct = async(productId) => {
    try {
        const workOrderByProductDB = await WorkOrder.findOne({
            where: { product_id: productId },
            include: [
                { 
                    model: User,
                    as: 'workOrdersManager',
                },
                { 
                    model: Worker,
                    as: 'workOrderWorkers',
                    include: [{ model: User, as: 'worker' }]
                },
                {
                    model: WorkMilestone,
                    as: 'workOrderWorkMilestones',
                    include: [{ model: Step, as: 'workMilestoneSteps' }]
                }
            ],
            order: [
                [ 'workOrderWorkMilestones', 'createdAt', 'ASC'],
                [ 'workOrderWorkMilestones', 'workMilestoneSteps', 'createdAt', 'ASC'],
            ]
        });
        if(!workOrderByProductDB){
            throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm chưa được tạo công việc. Vui lòng liên hệ quản lý')
        }
        const newWorkOrder = workOrderByProductDB.toJSON();
        const workOrderByProduct = {
            id: newWorkOrder.id,
            workMilestone: newWorkOrder.work_milestone,
            manager: {
                id: newWorkOrder.workOrdersManager.id,
                fullName: newWorkOrder.workOrdersManager.full_name,
                avatarUrl: newWorkOrder.workOrdersManager.avatar_url
            },
            createdAt: newWorkOrder.createdAt,
            updatedAt: newWorkOrder.updatedAt,
            workers: (newWorkOrder.workOrderWorkers ?? [])
                .filter((el) => el.worker_order_id === newWorkOrder.id)
                .map((worker) => {
                    return {
                        id: worker.worker.id,
                        fullName: worker.worker.full_name,
                        avatarUrl: worker.worker.avatar_url,
                    }
                }),
            workMilestones: (newWorkOrder.workOrderWorkMilestones ?? [])
                .map((workMilestone) => {
                    return{
                        id: workMilestone.id,
                        name: workMilestone.name,
                        step: workMilestone.step,
                        target: workMilestone.target,
                        createdAt: workMilestone.createdAt,
                        updatedAt: workMilestone.updatedAt,
                        steps: workMilestone.workMilestoneSteps
                    }
                }),
        };
        return workOrderByProduct;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message);
    }
}
module.exports = {
    queryProductsByOrderId,
    queryProductsByOrderIdAndStatus,
    getDetailWorkOrderByProduct
}