const { StatusCodes } = require('http-status-codes');
const { Product, Order, User, WorkMilestone, Worker, WorkOrder, Step, Customer, DimensionProduct, ImageStep, MilestoneChangeLog, Notification, WorkOrderChangeLog, ProductReview, Feedback, ImageFeedback, VideoFeedback, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');
const { getLabelEvaluatedStatus } = require('../utils/labelFromEnToVi');
const orderService = require('./order.service')


// Lấy danh sách sản phẩm theo id đơn hàng
const queryProductsByOrderId = async(orderId) => {
    try {
        const order = await Order.findByPk(orderId);
        if(!order){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại đơn hàng");
        }
        const productsDB = await Product.findAll({
            where: { order_id: orderId },
            include: [
                { model: User, as: 'productsUser' },
                { model: DimensionProduct, as: 'productDimension' }
            ]
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
                updatedAt: newProduct.updatedAt,
                nameImage: newProduct.name_image !== null ? newProduct.name_image : null,
                urlImage: newProduct.url_image !== null ? newProduct.url_image : null,
                isEvaluated: newProduct.is_evaluated,
                completedDate: newProduct.completed_date !== null ? newProduct.completed_date : null,
                dimension: {
                    length: newProduct.productDimension.length,
                    width: newProduct.productDimension.width,
                    height: newProduct.productDimension.height
                }
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
            include: [
                { model: User, as: 'productsUser' },
                { model: DimensionProduct, as: 'productDimension' }
            ]
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
                updatedAt: newProduct.updatedAt,
                nameImage: newProduct.name_image !== null ? newProduct.name_image : null,
                urlImage: newProduct.url_image !== null ? newProduct.url_image : null,
                isEvaluated: newProduct.is_evaluated,
                completedDate: newProduct.completed_date !== null ? newProduct.completed_date : null,
                dimension: {
                    length: newProduct.productDimension.length,
                    width: newProduct.productDimension.width,
                    height: newProduct.productDimension.height
                }
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
                    include: [
                        { 
                            model: Step, 
                            as: 'workMilestoneSteps',
                            include: [{ model: ImageStep, as: 'stepImageSteps' }] 
                        }
                    ]
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
            evaluatedStatus: newWorkOrder.evaluated_status,
            evaluationDescriptionWorkOrder: newWorkOrder.evaluation_description,
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
                        evaluatedStatus: workMilestone.evaluated_status,
                        evaluationDescription: workMilestone.evaluation_description,
                        reworkReason: workMilestone.rework_reason,
                        reworkStartedAt: workMilestone.rework_started_at,
                        reworkDeadline: workMilestone.rework_deadline,
                        version: workMilestone.version,
                        steps: (workMilestone.workMilestoneSteps ?? [])
                            .map((step) => {
                                return {
                                    id: step.id,
                                    name: step.name,
                                    proccess: step.proccess,
                                    progress: step.progress,
                                    createdAt: step.createdAt,
                                    updatedAt: step.updatedAt,
                                    images: step.stepImageSteps
                                }
                            })
                    }
                }),
        };
        return workOrderByProduct;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message);
    }
}

{/* Update hình ảnh và trạng thái sản phẩm */}
const updateImageAndStatusProduct = async(id, productBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { status, nameImage, urlImage } = productBody;
        const productDB = await Product.findByPk(id, { transaction });
        if(!productDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi này.")
        }
        productDB.status = status;
        productDB.name_image = nameImage;
        productDB.url_image = urlImage;
        productDB.proccess = 'completed_100%',
        productDB.completed_date = new Date().toISOString();
        await productDB.save({ transaction });
        
        const orderDB = await Order.findOne({
            where: { id: productDB.order_id }
        }, { transaction });
        orderDB.proccess = 'in_progress_50%'
        await orderDB.save({ transaction })
        await transaction.commit()
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

{/* Send request milestone */}
const sendRequestMilestone = async(id, requestBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { evaluatedStatus, reworkReason, reworkStartedAt, reworkDeadline, changedBy, changedRole, carpenters } = requestBody;
        const milestoneDB = await WorkMilestone.findByPk(id, { transaction });
        if(!milestoneDB) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi mốc công việc nào");
        }
        // 1. Insert dữ liệu vào bảng WorkMileHistorys, StepHistorys, ImageStepHistorys khi mốc công việc ở trạng thái rework

        await orderService.insertDataToTableHistoryWithStatusRework(milestoneDB, transaction);

        const oldEvaluatedStatus = milestoneDB.evaluated_status
        // 2. Insert trong bảng WorkMilestones
        milestoneDB.evaluated_status = evaluatedStatus;
        milestoneDB.rework_reason = reworkReason;
        milestoneDB.rework_started_at = reworkStartedAt;
        milestoneDB.rework_deadline = reworkDeadline;
        milestoneDB.save({ transaction });

        // 3. Update lại tiến độ trong step;
        const stepsDB = await Step.findAll({ where: { work_milestone_id: milestoneDB.id }}, { transaction });
        if(stepsDB.length === 0){
            throw new ApiError(StatusCodes.NOT_FOUND, 'Không tồn tại danh sách step nào');
        }
        for(const step of stepsDB){
            step.proccess = 'pending';
            step.progress = '0%';
            await step.save({ transaction });

        }

        // 4. Xóa ảnh của các step đó
        await ImageStep.destroy({ 
            where: { step_id: { [Op.in]: stepsDB.map((step) => step.id) }}
        }, { transaction });

        // 5. Insert trong bảng MilestoneChangeLogs
        await MilestoneChangeLog.create({
            work_order_id: milestoneDB.work_order_id,
            work_milestone_id: milestoneDB.id,
            field_name: 'evaluated_status',
            old_status: oldEvaluatedStatus,
            new_status: evaluatedStatus,
            changed_by: changedBy,
            changed_role: changedRole
        }, { transaction });

        // 6. Insert trong bảng Notifications
        if(carpenters.length > 0){
            for(const carpenter of carpenters){
                await Notification.create({
                    user_id: carpenter.id,
                    type: 'EVALUATED_STATUS_CHANGED',
                    title: `Mốc: ${milestoneDB.name}`,
                    content: `Trạng thái đánh giá được thay đổi từ ${getLabelEvaluatedStatus(oldEvaluatedStatus)} sang ${getLabelEvaluatedStatus(evaluatedStatus)}`
                })
            }
        }
        await transaction.commit()
    } catch (error) {
        if(error instanceof ApiError) throw error;
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

{/* Send evaluation milestone */}
const sendEvaluationMilestone = async(id, requestBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { evaluatedStatus, evaluationDescription, changedBy, changedRole, carpenters } = requestBody;
        const milestoneDB = await WorkMilestone.findByPk(id, { transaction });
        if(!milestoneDB) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi mốc công việc nào");
        }
        // 1. Insert dữ liệu vào bảng WorkMileHistorys, StepHistorys, ImageStepHistorys khi mốc công việc ở trạng thái approved

        await orderService.insertDataToTableHistoryWithStatusApproved(milestoneDB, transaction);

        const oldEvaluatedStatus = milestoneDB.evaluated_status
        // 2. Insert trong bảng WorkMilestones
        milestoneDB.evaluated_status = evaluatedStatus;
        milestoneDB.evaluation_description = evaluationDescription;
        milestoneDB.save({ transaction });

        // 3. Insert trong bảng MilestoneChangeLogs
        await MilestoneChangeLog.create({
            work_order_id: milestoneDB.work_order_id,
            work_milestone_id: milestoneDB.id,
            field_name: 'evaluated_status',
            old_status: oldEvaluatedStatus,
            new_status: evaluatedStatus,
            changed_by: changedBy,
            changed_role: changedRole
        }, { transaction });

        // 4. Insert trong bảng Notifications
        if(carpenters.length > 0){
            for(const carpenter of carpenters){
                await Notification.create({
                    user_id: carpenter.id,
                    type: 'EVALUATED_STATUS_CHANGED',
                    title: `Mốc: ${milestoneDB.name}`,
                    content: `Trạng thái đánh giá được thay đổi từ ${getLabelEvaluatedStatus(oldEvaluatedStatus)} sang ${getLabelEvaluatedStatus(evaluatedStatus)}`
                })
            }
        }
        await transaction.commit()
    } catch (error) {
        if(error instanceof ApiError) throw error;
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Send evaluation work order 
const sendEvaluationWorkOrder = async(id, evaluationWorkOrderBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { evaluatedStatusWorkOrder, evaluationDescriptionWorkOrder, changedBy, changedRole, carpenters} = evaluationWorkOrderBody;
        const workOrderDB = await WorkOrder.findByPk(id, { transaction });
        if(!workOrderDB) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi công việc nào");
        }
        const oldEvaluatedStatus = workOrderDB.evaluated_status;
        // 1. Insert trong bảng WorkOrders
        workOrderDB.evaluated_status = evaluatedStatusWorkOrder;
        workOrderDB.evaluation_description = evaluationDescriptionWorkOrder;
        workOrderDB.save({ transaction });

        // // 2. Update proccess trong bảng Orders
        // const orderDB = await Order.findOne({ where: { id: workOrderDB.order_id} }, { transaction });
        // if(!orderDB){
        //     throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại đơn hàng nào.")
        // }
        // orderDB.proccess = 'in_progress_75%'
        // orderDB.save({ transaction });

        // 3. Insert trong bảng WorkOrderChangeLogs
        await WorkOrderChangeLog.create({
            work_order_id: workOrderDB.id,
            field_name: 'evaluated_status',
            old_status: oldEvaluatedStatus,
            new_status: evaluatedStatusWorkOrder,
            changed_by: changedBy,
            changed_role: changedRole
        }, { transaction });

        // 4. Insert trong bảng Notifications 
        if(carpenters.length > 0){
            for(const carpenter of carpenters){
                await Notification.create({
                    user_id: carpenter.id,
                    type: 'EVALUATED_STATUS_CHANGED',
                    title: `Công việc: ${workOrderDB.name}`,
                    content: `Trạng thái đánh giá được thay đổi từ ${getLabelEvaluatedStatus(oldEvaluatedStatus)} sang ${getLabelEvaluatedStatus(evaluatedStatusWorkOrder)}`
                })
            }
        }
        await transaction.commit()
    } catch (error) {
        if(error instanceof ApiError) throw error;
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Evaluate product
const evaluationProduct = async(id, evaluationBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { reviews, comment, averageScore, orderId } = evaluationBody;
        const productDB = await Product.findByPk(id, { transaction });
        if(!productDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi sản phẩm nào.");
        }

        // 1. Insert dữ liệu vào bảng ProductReviews
        await ProductReview.create({
            product_id: productDB.id,
            overall_quality: reviews.overallQuality,
            aesthetics: reviews.aesthetics,
            customer_requirement: reviews.customerRequirement,
            satisfaction: reviews.satisfaction,
            comment,
            average_score: averageScore
        }, { transaction })
        
        // 2. Cập nhật trường is_evaluated trong bảng Products
        productDB.is_evaluated = true;
        await productDB.save({ transaction });
        
        // 3. Tìm bản ghi đơn hàng theo orderId để cập nhật trạng thái và tiến độ;
        const orderDB = await Order.findByPk(orderId, { transaction });
        if(!orderDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi đơn hàng nào.");
        }
        // 4. Tìm các bản ghi sản phẩm theo orderId để kiểm tra và update
        const productByOrderIdDB = await Product.findAll({
            where: { order_id: orderId },
            transaction
        });
        if(productByOrderIdDB.length === 0){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại các bản ghi sản phẩm nào");
        }
        const allEvaluatedProduct = productByOrderIdDB.every(p => p.is_evaluated === true);
        if(allEvaluatedProduct) {
            orderDB.status = 'completed';
            orderDB.proccess = 'completed_100%';
            orderDB.is_evaluated = true
            await orderDB.save({ transaction });
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: ", + error.message)
    }
}

// Lấy thông tin đánh giá sản phẩm theo id sản phẩm đã được đánh giá
const getDataEvaluationProduct = async(id) => {
    try {
        const productReviewDB = await ProductReview.findOne({
            where: { product_id: id },
        });
        if(!productReviewDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi do sản phẩm chưa được đánh giá.");
        };
        const newProductReview = productReviewDB.toJSON();
        const productReview = {
            id: newProductReview.id,
            overallQuality: newProductReview.overall_quality,
            aesthetics: newProductReview.aesthetics,
            customerRequirement: newProductReview.customer_requirement,
            satisfaction: newProductReview.satisfaction,
            comment: newProductReview.comment !== null ? newProductReview.comment : null,
            averageScore: newProductReview.average_score,
            createdAt: newProductReview.createdAt,
            updatedAt: newProductReview.updatedAt
        }
        return productReview;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Lấy danh sách sản phẩm đã được hoàn thành
const getCompletedProducts = async(queryOptions) => {
    try {
        const { page, limit, searchTerm } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = { 
            status: 'completed',
            ... (searchTerm && {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${searchTerm}%` }}
                ]
            }) 
        };

        const { count, rows: productsDB } = await Product.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Order, 
                    as: 'productsOrder',
                    required: false,
                    include: [{ model: Customer, as: 'ordersCustomer', required: false }]
                },
                {
                    model: Feedback,
                    as: 'productFeedback',
                    required: false,
                    include: [
                        { model: ImageFeedback, as: 'feedbackImages', required: false },
                        { model: VideoFeedback, as: 'feedbackVideo', required: false },
                    ] 
                }
            ],
            limit,
            offset,
            order: [[ 'createdAt', 'DESC' ]],
            distinct: true
        });
        const totalPages = Math.ceil(count/limit);
        const products = productsDB.map((productDB) => {
            const newProduct = productDB.toJSON();
            const order = newProduct.productsOrder;
            const customer = order.ordersCustomer;
            const feedback = newProduct.productFeedback;
            return {
                id: newProduct.id,
                name: newProduct.name,
                description: newProduct.description,
                target: newProduct.target,
                proccess: newProduct.proccess,
                status: newProduct.status,
                isCreated: newProduct.is_created,
                nameImage: newProduct.name_image,
                urlImage: newProduct.url_image,
                completedDate: newProduct.completed_date,
                isEvaluated: newProduct.is_evaluated,
                createdAt: newProduct.createdAt,
                updatedAt: newProduct.updatedAt,
                feedbackStatus: newProduct.feedback_status,
                order: {
                    id: order.id,
                    codeOrder: order.code_order,
                    name: order.name,
                    dateOfReceipt: order.date_of_receipt,
                    dateOfPayment: order.date_of_payment,
                    proccess: order.proccess,
                    status: order.status,
                    amount: order.amount,
                    requiredNote: order.required_note,
                    isCreatedWork: order.is_created_work,
                    isEvaluated: order.is_evaluated,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    feedbackStatus: order.feedback_status,
                    customer: {
                        id: customer.id,
                        name: customer.name,
                        phone: customer.phone,
                        address: customer.address,
                        amountOfOrders: customer.amount_of_orders,
                        createdAt: customer.createdAt,
                        updatedAt: customer.updatedAt,
                    }
                },
                feedback: feedback ? {
                    id: feedback.id,
                    rating: feedback.rating ? feedback.rating : null,
                    customerFeedbackText: feedback.customer_feedback_text,
                    staffNote: feedback.staff_note ? feedback.staff_note : null,
                    feedbackDate: feedback.feedback_date,
                    status: feedback.status,
                    createdAt: feedback.createdAt,
                    updatedAt: feedback.updatedAt,
                    images: (feedback.feedbackImages || [])
                        .map((image) => {
                            return{
                                id: image.id,
                                name: image.name,
                                url: image.url
                            }
                        }),
                    video: feedback.feedbackVideo ? {
                        id: feedback.feedbackVideo.id,
                        name: feedback.feedbackVideo.name,
                        url: feedback.feedbackVideo.url,
                        duration: feedback.feedbackVideo.duration
                    } : null
                } : null
            }
        })
        return{
            data: products,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}
module.exports = {
    queryProductsByOrderId,
    queryProductsByOrderIdAndStatus,
    getDetailWorkOrderByProduct,
    updateImageAndStatusProduct,
    sendRequestMilestone,
    sendEvaluationMilestone,
    sendEvaluationWorkOrder,
    evaluationProduct,
    getDataEvaluationProduct,
    getCompletedProducts
}