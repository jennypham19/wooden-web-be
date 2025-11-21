'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DesignRequestInputFile extends Model{
        static associate(models){
            DesignRequestInputFile.belongsTo(models.DesignRequest, {
                foreignKey: 'design_request_id',
                as: 'designRequest'
            });
            DesignRequestInputFile.belongsTo(models.InputFile, {
                foreignKey: 'input_file_id',
                as: 'inputFiles'
            })
        }
    }

    DesignRequestInputFile.init({
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
        // Cột input_file_id: khóa phụ bảng InputFile
        input_file_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'DesignRequestInputFile'
    });

    return DesignRequestInputFile;
}