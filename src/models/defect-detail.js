'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DefectDetail extends Model {
        static associate(models){
            DefectDetail.belongsTo(models.IssueReport, {
                foreignKey: 'issue_report_id',
                as: 'defectIssueReport'
            });
            DefectDetail.hasOne(models.ProposedSolution, {
                foreignKey: 'defect_detail_id',
                as: 'defectDetailProposedSolution'
            })
        }
    }

    DefectDetail.init({
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
        /*
        - dimesion: sai kích thước
        - design: sai bản vẽ
        - material: lỗi vật liệu
        - machine: lỗi máy móc
        - workmanship: tay nghề
        - installing: lỗi lắp đặt
        - labor_safety: an toàn lao động
        */
        defect_type: {
            type: DataTypes.ENUM('dimension', 'design', 'material', 'machine', 'workmanship', 'installing', 'labor_safety', 'other'),
            allowNull: true
        },
        defect_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        root_cause: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'DefectDetail'
    });
    return DefectDetail;
}