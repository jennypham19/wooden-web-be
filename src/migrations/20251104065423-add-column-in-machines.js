'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Machines');
    if(!tableDescription.image_url){
      await queryInterface.addColumn('Machines', 'image_url', {
        type: Sequelize.STRING,
        allowNull: false
      })
    };
    if(!tableDescription.name_url){
      await queryInterface.addColumn('Machines', 'name_url', {
        type: Sequelize.STRING,
        allowNull: false
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Machines', 'image_url');
    await queryInterface.removeColumn('Machines', 'name_url');
  }
};
