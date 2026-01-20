'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class IssueReportImage extends Model {
        static associate(models) {
            IssueReportImage.belongsTo(models.IssueReport, {
                foreignKey: 'issue_report_id',
                as: 'imagesIssueReport'
            })
        }
    }

    IssueReportImage.init({
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
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'IssueReportImage'
    });
    return IssueReportImage;
}