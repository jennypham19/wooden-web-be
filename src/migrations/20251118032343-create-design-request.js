'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('DesignRequests', {
      // Cột id: UUID tự sinh, là khóa chính
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
      },
        // Cột request_code: mã yêu cầu
        request_code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Mã sản phẩm, khóa phụ bảng Products
        product_id: {
            type: Sequelize.UUID,
            references: {
              model: 'Products', key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        // Tiêu đề yêu cầu
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Mô tả yêu cầu thiết kế
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        // Mã đơn hàng
        order_id: {
            type: Sequelize.UUID,
            references: {
              model: 'Orders', key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        // Mã khách hàng
        customer_id: {
            type: Sequelize.UUID,
            references: {
              model: 'Customers', key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        // Mã người phụ trách + quản lý
        curator_id: {
            type: Sequelize.UUID,
            references: {
              model: 'Users', key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        // Trạng thái
        status: {
            type: Sequelize.ENUM('pending', 'done'),
            allowNull: false,
            defaultValue: 'pending'
        },
        // Deadline hoàn thành bản thiết kế
        due_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        // Ngày hoàn thành bản thiết kế
        completed_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        // Mức độ ưu tiên
        priority: {
            type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
            allowNull: false,
            defaultValue: 'medium'
        },
        // Yêu cầu đặc biệt từ khách hàng
        special_requirement: {
            type: Sequelize.TEXT,
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
    await queryInterface.dropTable('DesignRequests')
  }
};
