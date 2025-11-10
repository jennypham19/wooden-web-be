'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('BOMs', {
        // Cột id
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            allowNull: false,
            primaryKey: true
        },
        // Cột code: mã định danh của BOM
        code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột amount: số lượng vật tư của BOM
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        // Cột product_id: khóa phụ bảng Products
        product_id: {
            type: Sequelize.UUID,
            references: {
              model: 'Products', key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        // Cột user_id: khóa phụ bảng Users
        user_id: {
            type: Sequelize.UUID,
            references: {
              model: 'Users', key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
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
    await queryInterface.dropTable('BOMs')
  }
};
