'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('WorkMilestones');
    if(!tableDescription.evaluated_status){
      await queryInterface.addColumn('WorkMilestones', 'evaluated_status', {
        type: Sequelize.ENUM('pending', 'rework', 'approved', 'overdue'),
        allowNull: false,
        defaultValue: 'pending'
      })
    };
    if(!tableDescription.evaluation_description){
      await queryInterface.addColumn('WorkMilestones', 'evaluation_description', {
        type: Sequelize.TEXT,
        allowNull: true,
      })
    };
    if(!tableDescription.rework_reason){
      await queryInterface.addColumn('WorkMilestones', 'rework_reason', {
        type: Sequelize.TEXT,
        allowNull: true,
      })
    };
    if(!tableDescription.rework_deadline){
      await queryInterface.addColumn('WorkMilestones', 'rework_deadline', {
        type: Sequelize.DATE,
        allowNull: true,
      })
    };
    if(!tableDescription.rework_started_at){
      await queryInterface.addColumn('WorkMilestones', 'rework_started_at', {
        type: Sequelize.DATE,
        allowNull: true,
      })
    };
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('WorkMilestones', 'evaluated_status');
    await queryInterface.removeColumn('WorkMilestones', 'evaluation_description');
    await queryInterface.removeColumn('WorkMilestones', 'rework_reason');
    await queryInterface.removeColumn('WorkMilestones', 'rework_deadline');
    await queryInterface.removeColumn('WorkMilestones', 'rework_started_at');
  }
};
