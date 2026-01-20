'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ProposedSolutions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
      },
      defect_detail_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'DefectDetails', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      proposed_solution: {
        type: Sequelize.ENUM('fix', 'rework', 'redesign', 'scrap', 'wait_decision', 'replace', 'unfixable'),
        allowNull: true
      },
      reason_unfixable: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      approved_solution: {
        type: Sequelize.ENUM('fix', 'rework', 'redesign', 'scrap', 'wait_decision', 'replace', 'unfixable'),
        allowNull: true
      },
      approval_solution_status: {
        type: Sequelize.ENUM('approved', 'rejected', 'cancelled'),
        allowNull: true
      },
      processing_status: {
        type: Sequelize.ENUM('in_progress', 'wait_approval', 'done', 'rejected', 'cancelled'),
        defaultValue: 'wait_approval'
      },
      estimated_fix_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expected_finish_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      technical_note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      approved_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      reason: {
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
    await queryInterface.dropTable('ProposedSolutions')
  }
};
