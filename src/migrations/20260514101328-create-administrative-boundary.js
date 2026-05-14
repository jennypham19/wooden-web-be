'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('AdministrativeBoundaries', {
        // cột id: khóa chính, kiểu UUID, tự động sinh giá trị mặc định
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            allowNull: false,
            primaryKey: true
        },
        // cột code: mã định danh của ranh giới hành chính, kiểu số, không null
        code: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        // cột name: tên của ranh giới hành chính, kiểu chuỗi, không null
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // cột division_type: loại ranh giới hành chính (tỉnh, huyện, xã), kiểu chuỗi, không null
        division_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // cột code_name: tên mã của ranh giới hành chính, kiểu chuỗi, không null
        code_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // cột type: loại địa giới; 0: trước sáp nhập, 1: sau sáp nhập, kiểu số, không null
        type: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        // cột provice_code: mã tỉnh của ranh giới hành chính, kiểu số, có thể null
        province_code: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        // cột district_code: mã huyện của ranh giới hành chính, kiểu số, có thể null
        district_code: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        // cột createdAt: ngày tạo bản ghi, kiểu DATE, không null
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        // cột updatedAt: ngày cập nhật bản ghi, kiểu DATE, không null
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
