'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InputFile extends Model{
        static associate(models){
            InputFile.hasMany(models.DesignRequestInputFile, {
                foreignKey: 'input_file_id',
                as: 'inputFilesRequest'
            }),
            InputFile.hasMany(models.OrderInputFile, {
                foreignKey: 'input_file_id',
                as: 'inputFilesOrder'
            })
        }
    }

    InputFile.init({
        // UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Tên của file đầu vào (PDF, ảnh, video, ghi chú)
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Đường dẫn của file đầu vào (PDF, ảnh, video, ghi chú)
        url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'InputFile'
    });

    return InputFile;
}