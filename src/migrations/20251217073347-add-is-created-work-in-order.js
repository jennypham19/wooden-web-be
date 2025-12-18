'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Orders');
    if(!tableDescription.is_created_work){
      await queryInterface.addColumn('Orders', 'is_created_work', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    }
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('Orders', 'is_created_work');
  }
};
