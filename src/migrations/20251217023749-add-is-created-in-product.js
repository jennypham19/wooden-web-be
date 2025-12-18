'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Products');
    if(!tableDescription.is_created){
      await queryInterface.addColumn('Products', 'is_created', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    }
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('Products', 'is_created');
  }
};
