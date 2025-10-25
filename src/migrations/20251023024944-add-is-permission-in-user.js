'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Users');
    if(!tableDescription.is_permission){
      await queryInterface.addColumn('Users', 'is_permission', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'is_permission')
  }
};
