'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Orders');
    if(!tableDescription.reason){
      await queryInterface.addColumn('Orders', 'reason', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'reason');
  }
};
