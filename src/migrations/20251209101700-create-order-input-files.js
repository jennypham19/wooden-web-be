'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('OrderInputFiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
      },
      order_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Orders', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      input_file_id: {
        type: Sequelize.UUID,
        references: {
          model: 'InputFiles', key: 'id'
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
    await queryInterface.dropTable('OrderInputFiles')
  }
};
