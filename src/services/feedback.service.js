const { StatusCodes } = require("http-status-codes")
const ApiError = require("../utils/ApiError");
const { Feedback, Product, Order, Customer, User, ImageFeedback, VideoFeedback, sequelize } = require('../models');
const { Op } = require("sequelize");

// lưu feedback draft
const saveFeedbackDraft = async(feedbackBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { rating, customerFeedbackText, staffNote, orderId, productId, customerId, staffId, feedbackDate } = feedbackBody;
        await Feedback.create({
            order_id: orderId,
            product_id: productId,
            customer_id: customerId,
            staff_id: staffId,
            feedback_date: feedbackDate,
            rating,
            customer_feedback_text: customerFeedbackText,
            staff_note: staffNote,
            status: 'draft'
        }, { transaction });
        const productDB = await Product.findByPk(productId, { transaction });
        if(!productDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại sản phẩm này.")
        }
        productDB.feedback_status = 'draft';
        await productDB.save({ transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi xảy ra: ' + error.message)
    }
}

// lưu feedback confirmed
const saveFeedbackConfirmed = async(feedbackBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { rating, customerFeedbackText, orderId, productId, customerId, staffId, feedbackDate, images, video } = feedbackBody;
        // 1. Lưu dữ liệu vào bảng Feedbacks
        const feedbackDB = await Feedback.create({
            order_id: orderId,
            product_id: productId,
            customer_id: customerId,
            staff_id: staffId,
            feedback_date: feedbackDate,
            rating,
            customer_feedback_text: customerFeedbackText,
            status: 'confirmed'
        }, { transaction });

        // 2. Lưu ảnh
        for(const image of images){
            await ImageFeedback.create({
                feedback_id: feedbackDB.id,
                name: image.name,
                url: image.url
            }, { transaction })
        }

        // 3. Lưu video
        await VideoFeedback.create({
            feedback_id: feedbackDB.id,
            name: video.name,
            url: video.url,
            duration: video.duration
        }, { transaction })

        // 4. Lấy thông tin của bảng Products
        const productDB = await Product.findByPk(productId, { transaction });
        if(!productDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại sản phẩm này.")
        }
        productDB.feedback_status = 'confirmed';
        await productDB.save({ transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi xảy ra: ' + error.message)
    }
}

// Lấy danh sách feedback
const queryListFeedbacks = async(queryOptions) => {
    try {
        const { page, limit, orderCode, rating, status } = queryOptions;
        const filters = {
            orderCode,
            rating,
            status
        }
        const offset = (page - 1) * limit;
        const andConditions = [];
        // Tìm theo mã hơn hàng (OR group - có thể mở rộng thêm field khác)
        if(filters.orderCode){
            andConditions.push({
                [Op.or]: [{ '$feedbackOrder.code_order$': { [Op.iLike]: `%${filters.orderCode}%`} }]
            })
        }

        // Rating
        if(filters.rating !== 'all' && filters.rating !== undefined){
            andConditions.push({
                rating: filters.rating
            });
            // hoặc >=
            // rating: { [Op.gte]: rating }
        }

        // Status
        if(filters.status !== 'all' && filters.status !== undefined){
            andConditions.push({
                status: filters.status
            });
        }

        const where = andConditions.length ? { [Op.and]: andConditions } : {};
        const { count, rows: feedbacksDB } = await Feedback.findAndCountAll({
            where,
            include: [
                {
                    model: Order,
                    as: 'feedbackOrder',
                    attributes: ['id', 'code_order', 'name'],
                    required: true,
                },
                {
                    model: Product,
                    as: 'feedbackProduct',
                    attributes: ['id', 'name', 'name_image', 'url_image', 'status']
                },
                {
                    model: Customer,
                    as: 'feedbackCustomer',
                    attributes: ['id', 'name', 'phone']
                },
                {
                    model: User,
                    as: 'feedbackStaff',
                    attributes: ['id', 'full_name']
                },
                {
                    model: ImageFeedback,
                    as: 'feedbackImages'  
                },
                {
                    model: VideoFeedback,
                    as: 'feedbackVideo'
                }
            ],
            limit,
            offset,
            order: [[ 'feedback_date', 'DESC' ]],
            distinct: true
        })
        const totalPages = Math.ceil(count/limit);
        const feedbacks = feedbacksDB.map((feedback) => {
            const newFeedback = feedback.toJSON();
            return {
                id: newFeedback.id,
                order: newFeedback.feedbackOrder.code_order,
                product: newFeedback.feedbackProduct.name,
                nameImageProduct: newFeedback.feedbackProduct.name_image,
                urlImageProduct: newFeedback.feedbackProduct.url_image,
                statusProduct: newFeedback.feedbackProduct.status,
                customer: newFeedback.feedbackCustomer.name,
                phoneCustomer: newFeedback.feedbackCustomer.phone,
                staff: newFeedback.feedbackStaff.full_name,
                rating: newFeedback.rating,
                customerFeedbackText: newFeedback.customer_feedback_text,
                staffNote: newFeedback.staff_note,
                feedbackDate: newFeedback.feedback_date,
                status: newFeedback.status,
                createdAt: newFeedback.createdAt,
                updatedAt: newFeedback.updatedAt,
                images: (newFeedback.feedbackImages || [])
                    .map((image) => {
                        return{
                            id: image.id,
                            name: image.name,
                            url: image.url
                        }
                    }),
                video: newFeedback.feedbackVideo ? {
                    id: newFeedback.feedbackVideo.id,
                    name: newFeedback.feedbackVideo.name,
                    url: newFeedback.feedbackVideo.url,
                    duration: newFeedback.feedbackVideo.duration
                } : null
            }
        })
        return {
            data: feedbacks,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

module.exports = {
    saveFeedbackDraft,
    queryListFeedbacks,
    saveFeedbackConfirmed
}