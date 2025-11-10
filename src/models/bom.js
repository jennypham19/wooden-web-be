const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BOM extends Model {
        static associate(models){
            BOM.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'bomsUser'
            });
            BOM.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'bomProduct'
            });
            BOM.hasMany(models.Material, {
                foreignKey: 'bom_id',
                as: 'bomMaterials'
            });
            BOM.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'bomsOrder'
            });
        }
    }

    BOM.init({
        // Cột id
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // Cột code: mã định danh của BOM
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Cột amount: số lượng vật tư của BOM
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột product_id: khóa phụ bảng Products
        product_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Cột user_id: khóa phụ bảng Users
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        // Cột product_id: khóa phụ bảng Orders
        order_id: {
            type: DataTypes.UUID,
            allowNull: false
        } 
    }, {
        sequelize,
        modelName: 'BOM'
    });
    return BOM;
}