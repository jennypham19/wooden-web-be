'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('ReferenceLinks');
    if(tableDescription.name){
      await queryInterface.changeColumn('ReferenceLinks', 'name', {
        type: Sequelize.STRING,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('ReferenceLinks', 'name', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
};
