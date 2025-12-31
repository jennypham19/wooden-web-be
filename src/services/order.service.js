const { StatusCodes } = require('http-status-codes');
const { Order, Customer, Product, User, BOM, sequelize, OrderInputFile, OrderReferenceLink, InputFile, ReferenceLink, WorkMilestone, Worker, WorkOrder, Step, ImageStep, OrderChangeLog, Notification, WorkMilestoneHistory, StepHistory, ImageStepHistory } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op, where, STRING } = require('sequelize');
const { FormatDate } = require('../utils/DateTime');

/* ------------- Tạo đơn hàng -------------- */
const createOrder = async(orderBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { customerId, codeOrder, name, dateOfReceipt, dateOfPayment, proccess, status, amount, requiredNote, products, inputFiles, referenceLinks, createdBy } = orderBody;
        const order = await Order.create({
            customer_id: customerId,
            code_order: codeOrder,
            name,
            date_of_receipt: dateOfReceipt,
            date_of_payment: dateOfPayment,
            proccess,
            status,
            amount,
            required_note: requiredNote,
            created_by: createdBy
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
                },
                {
                    model: User,
                    as: 'orderCreatedBy'
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
                createdBy: newOrder.created_by,
                reason: newOrder.reason,
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
                            },
                            nameImage: product.name_image !== null ? product.name_image : null,
                            urlImage: product.url_image !== null ? product.url_image : null,
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
            createdBy: newOrder.created_by,
            reason: newOrder.reason,
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
                        },
                        nameImage: product.name_image !== null ? product.name_image : null,
                        urlImage: product.url_image !== null ? product.url_image : null,
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
                createdBy: newOrder.created_by,
                reason: newOrder.reason,
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
                            },
                            nameImage: product.name_image !== null ? product.name_image : null,
                            urlImage: product.url_image !== null ? product.url_image : null,
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

/* Update tiến độ và trạng thái của step, đồng thời lưu ảnh của từng step */
const updateStep = async(id, stepBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { proccess, progress, images, workMilestoneId } = stepBody;
        const stepDB = await Step.findByPk(id, { transaction });
        if(!stepDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi này.")
        }
        stepDB.proccess = proccess
        stepDB.progress = progress
        await stepDB.save({ transaction });
        if(images.length > 0){
            for(const image of images){
                await ImageStep.create({
                    name: image.name,
                    url: image.url,
                    step_id: id
                }, { transaction })
            }
        }

        // Check trường hợp khi các bước trong mốc đều hoàn thành thì cập nhật trong evaluated_status = 'pending'
        await updateEvaluatedStatusInWorkMilestone(workMilestoneId, transaction);

        await transaction.commit();
    } catch (error) {
        if(error instanceof ApiError) throw error;
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Cập nhật trường evaluatedStatus trong bảng WorkMilestone khi các bước đều hoàn thành hoặc chưa
const updateEvaluatedStatusInWorkMilestone = async(id, transaction) => {
    const workMilestoneDB = await WorkMilestone.findByPk(id, { transaction });
    if(!workMilestoneDB){
        throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi mốc công việc này.")
    }
    const stepsDB = await Step.findAll({ 
        where: { work_milestone_id: id }, 
        transaction
    });
    if(stepsDB.length === 0){
        throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại danh sách bước của mốc công việc này.")
    }
    const allStepDone = stepsDB.every(s => s.proccess === 'completed');
    if(!allStepDone) return;
    workMilestoneDB.evaluated_status = 'pending';
    await workMilestoneDB.save({ transaction });
    await insertDataToTableHistoryWithStatusPending(workMilestoneDB, transaction);
}

// Insert dữ liệu vào bảng WorkMileHistorys, StepHistorys, ImageStepHistorys khi mốc công việc ở trạng thái pending
const insertDataToTableHistoryWithStatusPending = async(workMilestone, transaction) => {
    const newWorkMilestone = workMilestone.toJSON();
    const workMilestoneHistoryDB = await WorkMilestoneHistory.create({
        work_milestone_id: newWorkMilestone.id,
        work_order_id: newWorkMilestone.work_order_id,
        version: newWorkMilestone.version,
        evaluated_status: newWorkMilestone.evaluated_status,
        action: 'PENDING'
    }, { transaction })
    const stepsDB = await Step.findAll({ where: { work_milestone_id: workMilestone.id }, transaction });
    
    for(const step of stepsDB){
        const newStep = step.toJSON()
        console.log("newStep: ", newStep);
        const stepHistoryDB = await StepHistory.create({
            work_milestone_history_id: workMilestoneHistoryDB.id,
            name: newStep.name,
            proccess: newStep.proccess,
            progress: newStep.progress
        }, { transaction });
        const imageStepDB = await ImageStep.findAll({ where: { step_id: step.id }, transaction })
        for(const imageStep of imageStepDB){
            const newImageStep= imageStep.toJSON()
            await ImageStepHistory.create({
                step_history_id: stepHistoryDB.id,
                name: newImageStep.name,
                url: newImageStep.url
            }, { transaction })
        }
    }

}

// Thêm mới step
const createStep = async(stepBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { workMilestoneId, name, proccess, progress } = stepBody;
        const workMilestoneDB = await WorkMilestone.findByPk(workMilestoneId, { transaction });
        if(!workMilestoneDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi này");
        }
        workMilestoneDB.step = workMilestoneDB.step + 1;
        workMilestoneDB.evaluated_status = 'not_reviewed';
        await workMilestoneDB.save({ transaction });

        await Step.create({
            name, proccess, progress, work_milestone_id: workMilestoneDB.id
        }, { transaction })

        await transaction.commit()
    } catch (error) {
        if(error instanceof ApiError) throw error;
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

/* Xóa bước vừa thêm */
const deleteStepAdded = async(stepId) => {
    const transaction = await sequelize.transaction();
    try {
        const stepAdded = await Step.findByPk(stepId, { transaction });
        if(!stepAdded){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi nào.")
        }
        const workMilestoneDB = await WorkMilestone.findOne({ where: { id: stepAdded.work_milestone_id }}, { transaction });
        workMilestoneDB.evaluated_status = 'pending';
        workMilestoneDB.step = workMilestoneDB.step - 1;
        await workMilestoneDB.save({ transaction });
        await Step.destroy({ where: { id: stepId }}, { transaction });
        await transaction.commit()
    } catch (error) {
        if(error instanceof ApiError) throw error;
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message);
    }
}

/* Update tiến độ đơn hàng khi xong hết tất cả các sản phẩm */
const updateProccessOrder = async(id, body) => {
    try {
        const { proccess } = body;
        const orderDB = await Order.findByPk(id);
        if(!orderDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi nào.")
        }
        orderDB.proccess = proccess
        await orderDB.save();
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

/* Update order */
const updateOrder = async(id, body) => {
    const transaction = await sequelize.transaction();
    try {
        const { dateOfPayment, reason, manager } = body;
        const orderDB = await Order.findByPk(id, { transaction });
        if(!orderDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi nào.")
        }
        const oldDate = orderDB.date_of_payment;
        // 1. Update order
        // await order.update({
        //     return_date: newDate,
        // });
        orderDB.date_of_payment = dateOfPayment;
        orderDB.reason = reason;
        await orderDB.save({ transaction });

        // 2. Save log
        await OrderChangeLog.create({
            order_id: orderDB.id,
            field_name: "date_of_payment",
            old_value: oldDate,
            new_value: dateOfPayment,
            changed_by: manager.id,
            changed_role: manager.role
        }, { transaction })

        // 3. Notify sale (Nếu không phải sale tự đổi)
        if(manager.role !== 'employee'){
            await Notification.create({
                user_id: orderDB.created_by,
                type: 'ORDER_DATE_OF_PAYMENT_CHANGED',
                title: `Đơn ${orderDB.code_order}`,
                content: `Ngày trả hàng được thay đổi từ ${FormatDate(orderDB.date_of_payment)} → ${FormatDate(dateOfPayment)}`
            }, { transaction })
        }
        await transaction.commit()
    } catch (error) {
        if(error instanceof ApiError) throw error;
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

/* Lấy danh sách đơn hàng có tiến độ là 75% để đánh giá */
const queryOrdersWithProccess = async(queryOptions) => {
    try {
        const { page, limit, searchTerm, isEvaluated } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = { proccess: 'in_progress_75%' };
        if(isEvaluated && isEvaluated !== 'all' && isEvaluated !== undefined && isEvaluated !== null){
            whereClause.is_evaluated = isEvaluated;
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
                },
                {
                    model: User,
                    as: 'orderCreatedBy'
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
                createdBy: newOrder.created_by,
                reason: newOrder.reason,
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
                            },
                            nameImage: product.name_image !== null ? product.name_image : null,
                            urlImage: product.url_image !== null ? product.url_image : null,
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

/* Lấy danh sách đơn hàng theo id của người quản lý */
const queryOrdersByIdManager = async(queryOptions) => {
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
                    where: { manager_id: id },
                    include: [{ model: User, as: 'productsUser' }]
                },
                {
                    model: User,
                    as: 'orderCreatedBy'
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
                createdBy: newOrder.created_by,
                reason: newOrder.reason,
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
                            },
                            nameImage: product.name_image !== null ? product.name_image : null,
                            urlImage: product.url_image !== null ? product.url_image : null,
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

/* Lấy danh sách đơn hàng có công việc được tạo bởi id quản lý */
const queryOrdersWithWorkByIdManager = async(queryOptions) => {
    try {
        const { page, limit, searchTerm, status, id } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = {};
        const whereWork = {};
        if(searchTerm){
            whereClause[Op.or] = [
                { code_order: { [Op.iLike]: `%${searchTerm}%` }},
                { name: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        }
        if(status && status !== 'all'){
            whereWork.evaluated_status = status;
        }        
        const { count, rows: ordersDB } = await Order.findAndCountAll({
            where: whereClause,
            subQuery: false,
            include: [
                {
                    model: Customer,
                    as: 'ordersCustomer'
                },
                {
                    model: Product,
                    as: 'orderProducts',
                    where: { manager_id: id },
                    required: true,
                    include: [
                        { model: User, as: 'productsUser' },
                        { 
                            model: WorkOrder, 
                            as: 'productWorkOrder', 
                            where: whereWork, 
                            required: status && status !== 'all'
                        }
                    ]
                },
                {
                    model: User,
                    as: 'orderCreatedBy'
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
                createdBy: newOrder.created_by,
                reason: newOrder.reason,
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
                            },
                            nameImage: product.name_image !== null ? product.name_image : null,
                            urlImage: product.url_image !== null ? product.url_image : null,
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
    updateStep,
    createStep,
    updateProccessOrder,
    updateOrder,
    queryOrdersWithProccess,
    queryOrdersByIdManager,
    queryOrdersWithWorkByIdManager,
    deleteStepAdded
}