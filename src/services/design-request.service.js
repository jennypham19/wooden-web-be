const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const { Order, Product, Customer, User, DesignRequest, DesignRequestInputFile, DesignRequestReferenceLink, ReferenceLink, InputFile, TechnicalSpecification, sequelize } = require('../models');

// Lấy danh sách yêu cầu thiết kế
const queryListDesignRequest = async(queryOptions) => {
    try {
        const { page, limit, searchTerm } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = {};
        if(searchTerm){

        }
        const { count, rows: designRequestDB } = await DesignRequest.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Order,
                    as: 'designRequestsOrder',
                    attributes: ['name'],
                },
                {
                    model: Product,
                    as: 'designRequestProduct',
                    attributes: ['name']
                },
                {
                    model: Customer,
                    as: 'designRequestCustomer',
                    attributes: ['name']
                },
                {
                    model: User,
                    as: 'designRequestUser',
                    attributes: ['full_name']
                },
            ],
            limit,
            offset,
            order: [[ 'createdAt', 'DESC' ]],
            distinct: true
        });
        const totalPages = Math.ceil(count/limit);
        const designRequests = designRequestDB.map((designRequest) => {
            const newDesignRequest = designRequest.toJSON();
            return{
                id: newDesignRequest.id,
                requestCode: newDesignRequest.request_code,
                productName: newDesignRequest.designRequestProduct.name,
                orderName: newDesignRequest.designRequestsOrder.name,
                customerName: newDesignRequest.designRequestCustomer.name,
                curatorName: newDesignRequest.designRequestUser.full_name,
                status: newDesignRequest.status,
                dueDate: newDesignRequest.due_date,
                completedDate: newDesignRequest.completed_date,
                createdAt: newDesignRequest.createdAt,
                updatedAt: newDesignRequest.updatedAt
            }
        })
        return {
            data: designRequests,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi xảy ra: ' + error.message)
    }
}

// Tạo mới yêu cầu
const createDesignRequest = async(designRequestBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { requestCode, title, orderId, productId, customerId, curatorId, priority, status, dueDate, description, specialRequirement, inputFiles, referenceLinks, technicalSpecification } = designRequestBody;
        const designRequest = await DesignRequest.create({
            request_code: requestCode,
            title,
            order_id: orderId,
            product_id: productId,
            customer_id: customerId,
            curator_id: curatorId,
            priority,
            status,
            due_date: dueDate,
            description,
            special_requirement: specialRequirement
        }, { transaction });

        if(inputFiles.length > 0){
            for(const inputFile of inputFiles){
                const inputFileDB = await InputFile.create({ name: inputFile.name, url: inputFile.url }, { transaction });
                await DesignRequestInputFile.create({ design_request_id: designRequest.id, input_file_id: inputFileDB.id }, { transaction })
            }
        }
        if(referenceLinks.length > 0){
            for(const referenceLink of referenceLinks){
                const referenceLinkDB = await ReferenceLink.create({ url: referenceLink.url }, { transaction });
                await DesignRequestReferenceLink.create({ design_request_id: designRequest.id, reference_link_id: referenceLinkDB.id }, { transaction });
            }
        }
        await TechnicalSpecification.create({
            design_request_id: designRequest.id,
            length: technicalSpecification.length,
            width: technicalSpecification.width,
            height: technicalSpecification.height,
            weight: technicalSpecification.weight,
            material: technicalSpecification.material,
            color: technicalSpecification.color,
            note: technicalSpecification.note
        }, { transaction });

        const orderDB = await Order.findByPk(orderId);
        if(!orderDB) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Đơn hàng không tồn tại");
        }
        
        await orderDB.update({
            status: 'in_progress',
            proccess: 'in_progress_25%'
        }, { transaction })
        
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi xảy ra: ' + error.message)
    }
}


// Lấy chi tiết 1 bản ghi
const getDetailDesignRequets = async(id) => {
    try {
        const designRequestDB = await DesignRequest.findByPk(id, {
            include: [
                {
                    model: Order,
                    as: 'designRequestsOrder',
                    attributes: ['name'],
                },
                {
                    model: Product,
                    as: 'designRequestProduct',
                    attributes: ['name']
                },
                {
                    model: Customer,
                    as: 'designRequestCustomer',
                    attributes: ['name']
                },
                {
                    model: User,
                    as: 'designRequestUser',
                    attributes: ['full_name']
                },
                {
                    model: DesignRequestInputFile,
                    as: 'designRequestInputFiles',
                    include: [{ model: InputFile, as: 'inputFiles' }]
                },
                {
                    model: DesignRequestReferenceLink,
                    as: 'designRequestReferenceLinks',
                    include: [{ model: ReferenceLink, as: 'referenceLinks' }]
                },
                {
                    model: TechnicalSpecification,
                    as: 'requestTechnicalSpecifications'
                }
            ]
        });
        const newDesignRequest = designRequestDB.toJSON();
        const designRequest = {
            id: newDesignRequest.id,
            requestCode: newDesignRequest.request_code,
            productName: newDesignRequest.designRequestProduct.name,
            orderName: newDesignRequest.designRequestsOrder.name,
            customerName: newDesignRequest.designRequestCustomer.name,
            curatorName: newDesignRequest.designRequestUser.full_name,
            status: newDesignRequest.status,
            dueDate: newDesignRequest.due_date,
            completedDate: newDesignRequest.completed_date,
            title: newDesignRequest.title,
            description: newDesignRequest.description,
            priority: newDesignRequest.priority,
            specialRequirement: newDesignRequest.special_requirement,
            createdAt: newDesignRequest.createdAt,
            updatedAt: newDesignRequest.updatedAt,
            inputFiles: (newDesignRequest.designRequestInputFiles ?? []).map((input) => input.inputFiles),
            referenceLinks: (newDesignRequest.designRequestReferenceLinks ?? []).map((link) => link.referenceLinks),
            technicalSpecification: newDesignRequest.requestTechnicalSpecifications
        }
        return designRequest;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}
module.exports = {
    queryListDesignRequest,
    createDesignRequest,
    getDetailDesignRequets
}