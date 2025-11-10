'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Machines', {
        // Cột id: UUID tự sinh, là khóa chính
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        // tên máy
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        // mã máy
        code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // thông số
        specifications: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // thương hiệu
        brand: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // trọng lượng
        weight: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // kích thước
        dimensions: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // công suất
        power: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // phần trăm bảo dưỡng
        maintenance_percentage: {
            type: Sequelize.STRING,
            allowNull: true
        },
        // tình trạng
        /*
            1. Đang hoạt động
            2. Tạm dừng
            3. Ngừng hoạt động
            4. Đang bảo trì
            5. Đang sửa chữa
            6. Lỗi/ Hỏng
        */
        status: {
            type: Sequelize.ENUM('operating', 'paused', 'stopped', 'under_maintenance', 'under_repair', 'faulty'),
            allowNull: false,
        },
        // ngày bảo dưỡng
        maintenance_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        // ngày hoàn thành
        completion_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        // ngày mua
        purchase_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        // ngày hết hạn bảo hành
        warranty_expiration_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        // mô tả
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        // lý do
        reason: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        // ngày khởi động lại
        start_again_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Machines')
  }
};
