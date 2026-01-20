'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AuditTrail extends Model{
        static associate(models){
            AuditTrail.belongsTo(models.IssueReport, {
                foreignKey: 'issue_report_id',
                as: 'auditTrailIssueReport'
            });
            AuditTrail.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'auditTrailCreatedBy'
            })
        }
    }

    AuditTrail.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        issue_report_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'AuditTrail'
    });
    return AuditTrail;
}