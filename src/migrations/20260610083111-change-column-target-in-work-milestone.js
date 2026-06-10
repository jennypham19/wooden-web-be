'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('WorkMilestones');
    if(tableDescription.target){
      await queryInterface.changeColumn('WorkMilestones', 'target', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('WorkMilestones', 'target', {
      type: Sequelize.TEXT,
      allowNull: false
    })
  }
};
