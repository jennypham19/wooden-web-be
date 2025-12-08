const { StatusCodes } = require("http-status-codes")
const ApiError = require("../utils/ApiError")
const { Machine } = require("../models")
const { Op } = require('sequelize');

// Tạo máy móc
const createMachine = async(machineBody) => {
    try {
        const { name, code, brand, weight, dimensions, power, status, purchaseDate, warrantyExpirationDate, description, imageUrl, nameUrl} = machineBody;
        await Machine.create({
            code, name, brand, weight, dimensions, power, status,
            purchase_date: purchaseDate,
            warranty_expiration_date: warrantyExpirationDate,
            image_url: imageUrl,
            name_url: nameUrl,
            description
        })
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Lấy danh sách máy móc
const queryListMachines = async(queryOptions) => {
    try {
        const { page, limit, searchTerm, status } = queryOptions;
        const offset = (page - 1) * limit;
        const whereClause = {};
        if(status && status !== 'all'){
            whereClause.status = status;
        }
        if(searchTerm){
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${searchTerm}%` }},
                { code: { [Op.iLike]: `%${searchTerm}%` }},
                { brand: { [Op.iLike]: `%${searchTerm}%` }},
                { weight: { [Op.iLike]: `%${searchTerm}%` }},
                { dimensions: { [Op.iLike]: `%${searchTerm}%` }},
                { power: { [Op.iLike]: `%${searchTerm}%` }},
            ]
        }
        const { count, rows: machinesDB } = await Machine.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[ 'createdAt', 'DESC' ]]
        });
        const totalPages = Math.ceil(count/limit);
        const machines = machinesDB.map((machine) => {
            const newMachine = machine.toJSON();
            return {
                id: newMachine.id,
                name: newMachine.name,
                code: newMachine.code,
                brand: newMachine.brand,
                weight: newMachine.weight,
                dimensions: newMachine.dimensions,
                power: newMachine.power,
                status: newMachine.status,
                maintenancePercentage: newMachine.maintenance_percentage,
                purchaseDate: newMachine.purchase_date,
                warrantyExpirationDate: newMachine.warranty_expiration_date,
                imageUrl: newMachine.image_url,
                nameUrl: newMachine.name_url,
                reason: newMachine.reason,
                startAgainDate: newMachine.start_again_date,
                maintenanceDate: newMachine.maintenance_date,
                completionDate: newMachine.completion_date,
                createdAt: newMachine.createdAt,
                updatedAt: newMachine.updatedAt,
                repairedDate: newMachine.repair_date
            }
        })
        return {
            data: machines,
            totalPages,
            currentPage: page,
            total: count
        }
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Lấy danh sách chi tiết bản ghi
const getMachineById = async(id) => {
    try {
        const machineDB = await Machine.findByPk(id);
        if(!machineDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại bản ghi nào");
        }
        const newMachine = machineDB.toJSON();
        const machine = {
            id: newMachine.id,
            name: newMachine.name,
            code: newMachine.code,
            brand: newMachine.brand,
            weight: newMachine.weight,
            dimensions: newMachine.dimensions,
            power: newMachine.power,
            status: newMachine.status,
            maintenancePercentage: newMachine.maintenance_percentage,
            purchaseDate: newMachine.purchase_date,
            warrantyExpirationDate: newMachine.warranty_expiration_date,
            imageUrl: newMachine.image_url,
            nameUrl: newMachine.name_url,
            reason: newMachine.reason,
            startAgainDate: newMachine.start_again_date,
            maintenanceDate: newMachine.maintenance_date,
            completionDate: newMachine.completion_date,
            createdAt: newMachine.createdAt,
            updatedAt: newMachine.updatedAt,
            repairedDate: newMachine.repair_date
        }
        return machine;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

// Cập nhật máy móc theo trạng thái
const updateMachineByStatus = async(id, machineBody) => {
    try {
        const { status, startAgainDate, repairedDate, maintenanceDate, reason, maintenancePercentage } = machineBody;
        const machineDB = await Machine.findByPk(id);
        if(!machineDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Bản ghi máy móc không tồn tại.");
        }
        await machineDB.update({
            status,
            reason,
            start_again_date: startAgainDate,
            repair_date: repairedDate,
            maintenance_date: maintenanceDate,
            maintenance_percentage: maintenancePercentage
        })
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message);
    }
}

// Cập nhật ngày sửa xong và trạng thái máy móc khi đang ở trạng thái Đang sửa chữa
const updateMachineCompletionDate = async(id, machineBody) => {
    try {
        const { status, completionDate } = machineBody;
        const machineDB = await Machine.findByPk(id);
        if(!machineDB){
            throw new ApiError(StatusCodes.NOT_FOUND, "Bản ghi máy móc không tồn tại.")
        }
        await machineDB.update({ status, completion_date: completionDate})
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message);
    }
}

module.exports = {
    createMachine,
    queryListMachines,
    getMachineById,
    updateMachineByStatus,
    updateMachineCompletionDate
}