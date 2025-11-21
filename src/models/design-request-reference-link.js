'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DesignRequestReferenceLink extends Model{
        static associate(models){
            DesignRequestReferenceLink.belongsTo(models.DesignRequest, {
                foreignKey: 'design_request_id',
                as: 'designRequest'
            });
            DesignRequestReferenceLink.belongsTo(models.ReferenceLink, {
                foreignKey: 'reference_link_id',
                as: 'referenceLinks'
            })
        }
    }

    DesignRequestReferenceLink.init({
        // UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Cột design_request_id: khóa phụ bảng DesignRequest
        design_request_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Cột reference_link_id: khóa phụ bảng ReferenceLink
        reference_link_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'DesignRequestReferenceLink'
    });

    return DesignRequestReferenceLink;
}