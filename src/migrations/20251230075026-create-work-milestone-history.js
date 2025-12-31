'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('WorkMilestoneHistorys', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      work_order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'WorkOrders', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      work_milestone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'WorkMilestones', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      evaluated_status: {
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
    await queryInterface.dropTable('WorkMilestoneHistorys')
  }
};
