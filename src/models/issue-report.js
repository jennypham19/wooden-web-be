'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class IssueReport extends Model{
        static associate(models){
            IssueReport.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'issueReportOrder'
            }),
            IssueReport.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'issueReportProduct'
            }),
            IssueReport.belongsTo(models.Step, {
                foreignKey: 'step_id',
                as: 'issueReportStep'
            }),
            IssueReport.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'issueReportCreatedBy'
            }),
            IssueReport.belongsTo(models.User, {
                foreignKey: 'assigned_to',
                as: 'issueReportAssignedTo'
            }),
            IssueReport.hasMany(models.IssueReportImage, {
                foreignKey: 'issue_report_id',
                as: 'issueReportImages'
            });
            IssueReport.hasMany(models.AuditTrail, {
                foreignKey: 'issue_report_id',
                as: 'issueReportAuditTrail'
            }),
            IssueReport.hasMany(models.DefectDetail, {
                foreignKey: 'issue_report_id',
                as: 'issueReportDefect'
            })
        }
    }

    IssueReport.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        step_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('defect', 'material_shortage'),
            allowNull: true
        },
        severity: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'serious'),
            defaultValue: 'low',
            allowNull: false
        },
        description_detail: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('draft', 'submitted', 'confirmed', 'in_progress', 'received', 'completed', 'resolved', 'closed', 'rejected', 'cancelled'),
            allowNull: false,
            defaultValue: 'draft'
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false
        },
        assigned_to: {
            type: DataTypes.UUID,
            allowNull: false
        },
        internal_note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        rejected_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'IssueReport'
    });
    return IssueReport;
}