'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Machines');
    if(!tableDescription.repair_date){
      await queryInterface.addColumn('Machines', 'repair_date', {
        type: Sequelize.DATE,
        allowNull: true
      })
    };
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Machines', 'repair_date');
  }
};
