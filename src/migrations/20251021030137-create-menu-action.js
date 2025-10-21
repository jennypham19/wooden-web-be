'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('MenuActions', {
      // id của menu-action, kiểu UUID, khóa chính, không null, sự sinh UUID v4 khi tạo mới
      id: { 
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'), // Nếu dùng PostgreSQL, tạo UUID bằng pgcrypto
        // hoặc với MySQL: Sequelize.literal('(UUID())')
        primaryKey: true,
        allowNull: false
      },
      menu_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Menus', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      action_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Actions', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      code: {
        type: Sequelize. STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('MenuActions')
  }
};
