'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Orders');
    if(!tableDescription.internal_note){
      await queryInterface.addColumn('Orders', 'internal_note', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'internal_note');
  }
};
