const { StatusCodes } = require('http-status-codes');
const { Product, Order, User, WorkMilestone, Worker, WorkOrder, Step, Customer, DimensionProduct, ImageStep, MilestoneChangeLog, Notification, WorkOrderChangeLog, ProductReview, Feedback, ImageFeedback, VideoFeedback, sequelize } = require('../models');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

// Lấy mốc công việc + các bước + hình ảnh các bước theo id công việc
const getWorkMilestonesAndSteps = async(idWorkOrder) => {
    try {
        const workMilestonesDB = await WorkMilestone.findAll({
            where: { work_order_id: idWorkOrder },
            include: [
                { 
                    model: Step, 
                    as: 'workMilestoneSteps',
                    include: [{ model: ImageStep, as: 'stepImageSteps' }] 
                }
            ],
            order: [
                [ 'createdAt', 'ASC'],
                [ 'workMilestoneSteps', 'createdAt', 'ASC'],
            ]
        })
        if(workMilestonesDB.length === 0){
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tồn tại danh sách.")
        }
        const workMilestones = workMilestonesDB.map((workMilestone) => {
            const newWorkMilestone = workMilestone.toJSON();
            return{
                id: newWorkMilestone.id,
                name: newWorkMilestone.name,
                step: newWorkMilestone.step,
                target: newWorkMilestone.target,
                createdAt: newWorkMilestone.createdAt,
                updatedAt: newWorkMilestone.updatedAt,
                evaluatedStatus: newWorkMilestone.evaluated_status,
                evaluationDescription: newWorkMilestone.evaluation_description,
                reworkReason: newWorkMilestone.rework_reason,
                reworkStartedAt: newWorkMilestone.rework_started_at,
                reworkDeadline: newWorkMilestone.rework_deadline,
                version: newWorkMilestone.version,
                steps: (newWorkMilestone.workMilestoneSteps ?? [])
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
        })
        return workMilestones;
    } catch (error) {
        if(error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra: " + error.message)
    }
}

module.exports = {
    getWorkMilestonesAndSteps
}