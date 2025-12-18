const { StatusCodes } = require('http-status-codes');
const { Order, Customer, Product, User, BOM, sequelize, OrderInputFile, OrderReferenceLink, InputFile, ReferenceLink, WorkMilestone, Worker, WorkOrder, Step } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op, where } = require('sequelize');

/* ------------- Tạo đơn hàng -------------- */
const createOrder = async(orderBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { customerId, codeOrder, name, dateOfReceipt, dateOfPayment, proccess, status, amount, requiredNote, products, inputFiles, referenceLinks } = orderBody;
        const order = await Order.create({
            customer_id: customerId,
            code_order: codeOrder,
            name,
            date_of_receipt: dateOfReceipt,
            date_of_payment: dateOfPayment,
            proccess,
            status,
            amount,
            required_note: requiredNote
        }, { transaction })

        // Lưu sản phẩm
        if(products.length > 0 ){
            for(const product of products) {
                await Product.create({
                    name: product.name,
                    description: product.description,
                    target: product.target,
                    order_id: order.id,
                    manager_id: product.managerId,
                    status: product.status,
                    proccess: product.proccess
                }, { transaction })
            }
        }

        // Lưu files dữ liệu
        if(inputFiles.length > 0){
            for(const inputFile of inputFiles){
                const inputFileDB = await InputFile.create({ name: inputFile.name, url: inputFile.url }, { transaction });
                await OrderInputFile.create({ order_id: order.id, input_file_id: inputFileDB.id }, { transaction })
            }
        }
        // Lưu link tài liệu
        if(referenceLinks.length > 0){
            for(const referenceLink of referenceLinks){
                const referenceLinkDB = await ReferenceLink.create({ url: referenceLink.url }, { transaction });
                await OrderReferenceLink.create({ order_id: order.id, reference_link_id: referenceLinkDB.id }, { transaction })
            }
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi xảy ra: ' + error.message)
    }
}

/* ------------- Lấy danh sách đơn hàng ------------- */
const queryOrders = async(queryOptions) => {
    try {
        const { page, limit, searchTerm, status } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = {};
        if(status && status !== 'all'){
            whereClause.status = status;
        }
        if(searchTerm){
            whereClause[Op.or] = [
                { code_order: { [Op.iLike]: `%${searchTerm}%` }},
                { name: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        }
        const { count, rows: ordersDB } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Customer,
                    as: 'ordersCustomer'
                },
                {
                    model: Product,
                    as: 'orderProducts',
                    include: [{ model: User, as: 'productsUser' }]
                }
            ],
            limit,
            offset,
            order: [[ 'createdAt', 'DESC']],
            distinct: true
        });
        const totalPages = Math.ceil(count/limit);
        const orders = ordersDB.map((order) => {
            const newOrder = order.toJSON();
            return {
                id: newOrder.id,
                name: newOrder.name,
                customer: {
                    id: newOrder.ordersCustomer.id,
                    name: newOrder.ordersCustomer.name
                },
                codeOrder: newOrder.code_order,
                dateOfReceipt: newOrder.date_of_receipt,
                dateOfPayment: newOrder.date_of_payment,
                proccess: newOrder.proccess,
                status: newOrder.status,
                amount: newOrder.amount,
                requiredNote: newOrder.required_note,
                createdAt: newOrder.createdAt,
                updatedAt: newOrder.updatedAt,
                isCreatedWork: newOrder.is_created_work,
                products: (newOrder.orderProducts ?? [])
                    .filter((el) => el.order_id === newOrder.id)
                    .map((product) => {
                        return {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            target: product.target,
                            process: product.proccess,
                            status: product.status,
                            manager: {
                                fullName: product.productsUser.full_name,
                                role: product.productsUser.role,
                                phone: product.productsUser.phone
                            }
                        }
                    })
                
            }
        })
        return{
            data: orders,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

/* ------------- Lấy chi tiết đơn hàng ------------ */
const getDetailOrder = async(id) => {
    try {
        const orderDB = await Order.findByPk(id, {
            include: [
                {
                    model: Customer,
                    as: 'ordersCustomer'
                },
                {
                    model: Product,
                    as: 'orderProducts',
                    include: [{ model: User, as: 'productsUser' }]
                },
                {
                    model: OrderInputFile,
                    as: 'orderInputFiles',
                    include: [{ model: InputFile, as: 'inputFiles' }]
                },
                {
                    model: OrderReferenceLink,
                    as: 'orderReferenceLinks',
                    include: [{ model: ReferenceLink, as: 'referenceLinks' }]
                }
            ]
        });
        const newOrder = orderDB.toJSON();
        const order = {
            id: newOrder.id,
            name: newOrder.name,
            customer: {
                id: newOrder.ordersCustomer.id,
                name: newOrder.ordersCustomer.name
            },
            codeOrder: newOrder.code_order,
            dateOfReceipt: newOrder.date_of_receipt,
            dateOfPayment: newOrder.date_of_payment,
            proccess: newOrder.proccess,
            status: newOrder.status,
            amount: newOrder.amount,
            requiredNote: newOrder.required_note,
            createdAt: newOrder.createdAt,
            updatedAt: newOrder.updatedAt,
            isCreatedWork: newOrder.is_created_work,
            products: (newOrder.orderProducts ?? [])
                .filter((el) => el.order_id === newOrder.id)
                .map((product) => {
                    return {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        target: product.target,
                        proccess: product.proccess,
                        status: product.status,
                        isCreated: product.is_created,
                        manager: {
                            fullName: product.productsUser.full_name,
                            role: product.productsUser.role,
                            phone: product.productsUser.phone
                        }
                    }
                }),
            inputFiles: (newOrder.orderInputFiles ?? [])
                .filter((el) => el.order_id === newOrder.id)
                .map((inputFile) => inputFile.inputFiles),
            referenceLinks: (newOrder.orderReferenceLinks ?? [])
                .filter((el) => el.order_id === newOrder.id)
                .map((referenceLink) => referenceLink.referenceLinks)
        };
        return order;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message);
    }
}

/* ------------- Tạo mới công việc ------------- */
const saveOrderWork = async(orderWorkBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { orderId, managerId, productId, workMilestone, workers, workMilestones } = orderWorkBody;
        const workOrder = await WorkOrder.create({ 
            order_id: orderId,
            manager_id: managerId,
            product_id: productId,
            work_milestone: workMilestone
        }, { transaction });
        if(workers.length > 0){
            for(const worker of workers){
                await Worker.create({
                    worker_order_id: workOrder.id,
                    worker_id: worker.carpenterId
                }, { transaction })
                await User.update({ is_assigned: true }, { where: { id: worker.carpenterId }}, { transaction })
            }
        }
        if(workMilestones.length > 0){
            for(const workMilestone of workMilestones){
                const workMilestoneDB = await WorkMilestone.create({
                    work_order_id: workOrder.id,
                    name: workMilestone.name,
                    step: workMilestone.step,
                    target: workMilestone.target
                }, { transaction });

                if(workMilestone.steps.length > 0){
                    for(const step of workMilestone.steps){
                        await Step.create({
                            name: step.name,
                            proccess: step.proccess,
                            work_milestone_id: workMilestoneDB.id
                        }, { transaction })
                    }
                }
            }
        }
        await Product.update({ proccess : 'in_progress_25%', status: 'in_progress', is_created: true }, { where: { id: productId } }, { transaction })
        await Order.update({ proccess : 'in_progress_25%', status: 'in_progress', is_created_work: true }, { where: { id: orderId } }, { transaction })
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

/* Lấy danh sách đơn hàng đã được tạo mốc công việc + assign chính thợ mộc đó thông qua id ở role thợ mộc */
const queryOrdersByCarpenterId = async(queryOptions) => {
    try {
        const { page, limit, searchTerm, status, id } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = {};
        if(status && status !== 'all'){
            whereClause.status = status;
        }
        if(searchTerm){
            whereClause[Op.or] = [
                { code_order: { [Op.iLike]: `%${searchTerm}%` }},
                { name: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        }
        const { count, rows: ordersByCarpenterIdDB } = await Order.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Customer,
                    as: 'ordersCustomer'
                },
                {
                    model: Product,
                    as: 'orderProducts',
                    include: [{ model: User, as: 'productsUser' }]
                },
                {
                    model: WorkOrder,
                    as: 'orderWorkOrder',
                    required: true,
                    include: [
                        { 
                            model: Worker,
                            as: 'workOrderWorkers',
                            required: true,
                            where: { worker_id: id }
                        }
                    ]
                }
            ],
            limit,
            offset,
            order: [[ 'createdAt', 'DESC']],
            distinct: true
        });
        const totalPages = Math.ceil(count/limit);
        const orders = ordersByCarpenterIdDB.map((order) => {
            const newOrder = order.toJSON();
            return {
                id: newOrder.id,
                name: newOrder.name,
                customer: {
                    id: newOrder.ordersCustomer.id,
                    name: newOrder.ordersCustomer.name
                },
                codeOrder: newOrder.code_order,
                dateOfReceipt: newOrder.date_of_receipt,
                dateOfPayment: newOrder.date_of_payment,
                proccess: newOrder.proccess,
                status: newOrder.status,
                amount: newOrder.amount,
                requiredNote: newOrder.required_note,
                createdAt: newOrder.createdAt,
                updatedAt: newOrder.updatedAt,
                isCreatedWork: newOrder.is_created_work,
                products: (newOrder.orderProducts ?? [])
                    .filter((el) => el.order_id === newOrder.id)
                    .map((product) => {
                        return {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            target: product.target,
                            process: product.proccess,
                            status: product.status,
                            isCreated: product.is_created,
                            manager: {
                                fullName: product.productsUser.full_name,
                                role: product.productsUser.role,
                                phone: product.productsUser.phone
                            }
                        }
                    })
                
            }
        })
        return{
            data: orders,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

module.exports = {
    createOrder,
    queryOrders,
    getDetailOrder,
    saveOrderWork,
    queryOrdersByCarpenterId,
}