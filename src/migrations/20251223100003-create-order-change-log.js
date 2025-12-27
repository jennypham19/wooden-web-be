'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('OrderChangeLogs', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
        order_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'Orders', key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        // Cột field_name: tên trường thay đổi
        field_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        old_value: {
            type: Sequelize.DATE,
            allowNull: false
        },
        new_value: {
            type: Sequelize.DATE,
            allowNull: false
        },
        // Cột changed_by: id người thay đổi
        changed_by: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'Users', key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        changed_role: {
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
    await queryInterface.dropTable('OrderChangeLogs')
  }
};
