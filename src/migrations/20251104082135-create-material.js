'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Materials', {
        // Cột id
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            allowNull: false,
            primaryKey: true
        },
        // Cột code: mã vật tư
        code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột name: tên vật tư
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột unit: đơn vị vật tư
        unit: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột amount: định lượng vật tư
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        // Cột note: ghi chú vật tư
        note: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        // Cột bom_id: khóa phụ bảng BOMs
        bom_id: {
            type: Sequelize.UUID,
            references: {
              model: 'BOMs', key: 'id'
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
    await queryInterface.dropTable('Materials')
  }
};
