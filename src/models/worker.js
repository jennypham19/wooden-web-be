'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Worker extends Model {
        static associate (models){
            Worker.belongsTo(models.WorkOrder, {
                foreignKey: 'work_order_id',
                as: 'workersWorkOrder'
            });
            Worker.belongsTo(models.User, {
                foreignKey: 'worker_id',
                as: 'worker'
            })
        }
    }
    Worker.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        work_order_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        worker_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Worker'
    });
    return Worker;
}