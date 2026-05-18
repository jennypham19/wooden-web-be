'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AdministrativeBoundary extends Model {

    }

    AdministrativeBoundary.init({
        // cột id: khóa chính, kiểu UUID, tự động sinh giá trị mặc định
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        // cột code: mã định danh của ranh giới hành chính, kiểu số, không null
        code: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // cột name: tên của ranh giới hành chính, kiểu chuỗi, không null
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // cột division_type: loại ranh giới hành chính (tỉnh, huyện, xã), kiểu chuỗi, không null
        division_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // cột code_name: tên mã của ranh giới hành chính, kiểu chuỗi, không null
        code_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // cột type: loại địa giới; 0: trước sáp nhập, 1: sau sáp nhập, kiểu số, không null
        type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // cột provice_code: mã tỉnh của ranh giới hành chính, kiểu số, có thể null
        province_code: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        // cột district_code: mã huyện của ranh giới hành chính, kiểu số, có thể null
        district_code: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        // cột directly_under: mã cấp hành chính trực thuộc (nếu có), kiểu số, có thể null
        directly_under: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'AdministrativeBoundary'
    });
    return AdministrativeBoundary;
}