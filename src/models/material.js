const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Material extends Model {
        static associate(models){
            Material.belongsTo(models.BOM, {
                foreignKey: 'bom_id',
                as: 'materialsBOM'
            })
        }
    }

    Material.init({
        // Cột id
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Cột code: mã vật tư
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột name: tên vật tư
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột unit: đơn vị vật tư
        unit: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột amount: định lượng vật tư
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột note: ghi chú vật tư
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // Cột bom_id: khóa phụ bảng BOMs
        bom_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // url của hình ảnh vật tư
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // name của hình ảnh vật tư
        name_url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Material'
    });

    return Material;
}