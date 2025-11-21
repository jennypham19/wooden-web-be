'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('DesignRequests');
    if(tableDescription.completed_date){
      await queryInterface.changeColumn('DesignRequests', 'completed_date', {
        type: Sequelize.DATE,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('DesignRequests', 'completed_date', {
      type: Sequelize.DATE,
      allowNull: false
    })
  }
};
