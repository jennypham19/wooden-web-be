'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProposedSolution extends Model {
        static associate(models){
            ProposedSolution.belongsTo(models.DefectDetail, {
                foreignKey: 'defect_detail_id',
                as: 'proposedSolutionDefectDetail'
            });
            ProposedSolution.belongsTo(models.User, {
                foreignKey: 'approved_by',
                as: 'proposedSolutionApprovedBy'
            }) 
        }
    }

    ProposedSolution.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        defect_detail_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        /* phương án được đề xuất
            - fix: sửa trực tiếp
            - rework: gia công lại
            - redesign: điều chỉnh bản vẽ
            - scrap: loại bỏ/ làm lại
            - wait_decision: chờ quyết định
            - replace: thay vật liệu/ linh kiện
            - unfixable: không thể sửa
        */
        proposed_solution: {
            type: DataTypes.ENUM('fix', 'rework', 'redesign', 'scrap', 'wait_decision', 'replace', 'unfixable'),
            allowNull: true
        },
        // Lý do không thể sửa khi đề xuất phương án do kỹ thuật nhập
        reason_unfixable: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        /* phương án được duyệt
            - fix: sửa trực tiếp
            - rework: gia công lại
            - redesign: điều chỉnh bản vẽ
            - scrap: loại bỏ/ làm lại
            - replace: thay vật liệu/ linh kiện
            - unfixable: không thể sửa
            phương án được duyệt chỉ xảy ra khi processing_status = 'done'
        */
        approved_solution: {
            type: DataTypes.ENUM('fix', 'rework', 'redesign', 'scrap', 'replace', 'unfixable'),
            allowNull: true
        },
        /* trạng thái của phương án khi quản lý đã duyệt */
        approval_solution_status: {
            type: DataTypes.ENUM('approved', 'rejected', 'cancelled'),
            allowNull: true
        },
        /* trạng thái của phương án
            - wait_approval: chờ quản lý duyệt
            - in_progress: đang hoạt động
            - done: hoàn thành
            - rejected: từ chối
            - cancelled: hủy
        */
        processing_status: {
            type: DataTypes.ENUM('in_progress', 'wait_approval', 'done', 'rejected', 'cancelled'),
            defaultValue: 'wait_approval'
        },
        estimated_fix_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        expected_finish_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        technical_note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        approved_by: {
            type: DataTypes.UUID,
            allowNull: false
        },
        approved_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'ProposedSolution'
    });
    return ProposedSolution;
}