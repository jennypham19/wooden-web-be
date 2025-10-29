'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Drawing extends Model {
        static associate(models){

        }
    }

    Drawing.init({
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // mã bản vẽ
        code_drawing: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // mã yêu cầu
        request_design_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Phiên bản đầu
        version_first: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // phiên bản cuối
        version_finally: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // đường link bản vẽ đầu
        url_first: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // đường link bản vẽ cuối
        url_finally: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // tên bản vẽ đầu
        name_url_first: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // tên bản vẽ cuối
        name_url_finally: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Drawing'
    });
    return Drawing;
}