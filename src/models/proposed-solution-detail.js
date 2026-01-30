'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProposedSolutionDetail extends Model{
        static associate(models){

        }
    }

    ProposedSolutionDetail.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        proposed_solution_detail: {
            type: DataTypes.UUID,
            allowNull: false
        },
        proposed_solution_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description_detail: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        estimated_hours: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ProposedSolutionDetail'
    });
    return ProposedSolutionDetail;
}