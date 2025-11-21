'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ReferenceLink extends Model{
        static associate(models){
            ReferenceLink.hasMany(models.DesignRequestReferenceLink, {
                foreignKey: 'reference_link_id',
                as: 'referenceLinkRequest'
            })
        }
    }

    ReferenceLink.init({
        // UUID tự sinh, là khóa chính
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Tên của tài liệu bên ngoài (Google Drive, Figma, v.v.)
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Đường dẫn của tài liệu bên ngoài (Google Drive, Figma, v.v.)
        url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ReferenceLink'
    });

    return ReferenceLink;
}