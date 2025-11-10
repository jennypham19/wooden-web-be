const { StatusCodes } = require('http-status-codes');
const { BOM, Material, Product, Order, User, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');
const { iLikeText, iLikeNumberToText } = require('../helper/seach-text.helper');

// lưu BOM
const createBom = async(bomBody) => {
    const transaction = await sequelize.transaction();
    try {
        const { code, orderId, productId, amount, userId, materials} = bomBody;
        const bom = await BOM.create({
            code,
            order_id: orderId,
            product_id: productId,
            amount,
            user_id: userId
        }, { transaction })
        for(const material of materials){
            await Material.create({
                bom_id: bom.id,
                code: material.code,
                name: material.name,
                unit: material.unit,
                amount: material.amount,
                note: material.note,
                image_url: material.imageUrl,
                name_url: material.nameUrl
            }, { transaction })
        }
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// lấy ra danh sách BOM
const queryBoms = async(queryOptions) => {
    try {
        const { page, limit, searchTerm } = queryOptions;
        const offset = (page - 1) * limit; 
        const bomWhere  = {};
        const productWhere = {};
        const orderWhere = {};
        if(searchTerm){
            // Tìm theo code hoặc amount
            bomWhere [Op.or] = [
                { code: { [Op.iLike]: `%${searchTerm}%` }},
                { amount: { [Op.eq]: Number(searchTerm) || 0 }},
            ]; 
            console.log("bomWhere: ", bomWhere);

                
            // Tìm theo tên sản phẩm hoặc đơn hàng
            // Điều kiện cho Product
            productWhere.name = { [Op.iLike]: `%${searchTerm}%` };

            console.log("productWhere: ", productWhere);
            

            // Điều kiện cho Order
            orderWhere.name = { [Op.iLike]: `%${searchTerm}%` };
            console.log("orderWhere: ", orderWhere);

        }
        const { count, rows: bomsDB } = await BOM.findAndCountAll({
            where: bomWhere,
            include: [
                {
                    model: Material,
                    as: 'bomMaterials'
                },
                {
                    model: Product,
                    as: 'bomProduct',
                    attributes: ['name'],
                    required: false, // inner join nếu có điều kiện
                    where: Object.keys(productWhere).length ? productWhere : undefined,
                },
                {
                    model: Order,
                    as: 'bomsOrder',
                    attributes: ['name'],
                    required: false, // ✅ inner join nếu có điều kiện
                    where: Object.keys(orderWhere).length ? orderWhere : undefined,
                },
                {
                    model: User,
                    as: 'bomsUser',
                    attributes: ['full_name', 'id']
                }
            ],
            limit,
            offset,
            order: [[ 'createdAt', 'DESC']],
            distinct: true
        })
        const totalPages = Math.ceil(count/limit);
        const boms = bomsDB.map((bom) => {
            const newBom = bom.toJSON();
            return {
                id: newBom.id,
                code: newBom.code,
                amount: newBom.amount,
                nameProduct: newBom.bomProduct.name,
                nameOrder: newBom.bomsOrder.name,
                user: {
                    id: newBom.bomsUser.id,
                    fullName: newBom.bomsUser.full_name
                },
                createdAt: newBom.createdAt,
                updatedAt: newBom.updatedAt,
                materials: (newBom.bomMaterials ?? [])
                    .filter((el) => el.bom_id === newBom.id)
                    .map((material) => {
                        return{
                            id: material.id,
                            code: material.code,
                            name: material.name,
                            unit: material.unit,
                            amount: material.amount,
                            note: material.note,
                            imageUrl: material.image_url,
                            nameUrl: material.name_url,
                            createdAt: material.createdAt,
                            updatedAt: material.updatedAt
                        }
                    })
            }
        })
        return {
            data: boms,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

module.exports = {
    createBom,
    queryBoms
}