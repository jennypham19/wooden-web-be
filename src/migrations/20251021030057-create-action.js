'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Actions', {
      // id của action, kiểu UUID, khóa chính, không null, sự sinh UUID v4 khi tạo mới
      id: { 
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'), // Nếu dùng PostgreSQL, tạo UUID bằng pgcrypto
        // hoặc với MySQL: Sequelize.literal('(UUID())')
        primaryKey: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
    await queryInterface.dropTable('Actions')
  }
};
