'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderInputFile extends Model{
        static associate(models){
            OrderInputFile.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'order'
            });
            OrderInputFile.belongsTo(models.InputFile, {
                foreignKey: 'input_file_id',
                as: 'inputFiles'
            })
        }
    }

    OrderInputFile.init({
        // UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Cột order_id: khóa phụ bảng Orders
        order_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Cột input_file_id: khóa phụ bảng InputFiles
        input_file_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'OrderInputFile'
    });

    return OrderInputFile;
}