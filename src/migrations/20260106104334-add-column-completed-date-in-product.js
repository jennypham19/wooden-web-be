'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Products');
    if(!tableDescription.completed_date){
      await queryInterface.addColumn('Products', 'completed_date', {
        type: Sequelize.DATE,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'completed_date')
  }
};
