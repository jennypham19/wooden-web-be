'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TechnicalSpecification extends Model{
        static associate(models){
            TechnicalSpecification.belongsTo(models.DesignRequest, {
                foreignKey: 'design_request_id',
                as: 'technicalSpecificationsRequest'
            })
        }
    }

    TechnicalSpecification.init({
        // UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // khóa phụ bảng DesignRequest
        design_request_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Chiều dài thông số
        length: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Chiều rộng thông số
        width: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Chiều cao thông số
        height: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Khối lượng thông số
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        //  Chất liệu chính
        material: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Màu sắc
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Ghi chú kỹ thuật
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },{
        sequelize,
        modelName: 'TechnicalSpecification'
    });
    return TechnicalSpecification;
}