'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Materials');
    if(!tableDescription.image_url){
      await queryInterface.addColumn('Materials', 'image_url', {
        type: Sequelize.STRING,
        allowNull: false
      })
    };
    if(!tableDescription.name_url){
      await queryInterface.addColumn('Materials', 'name_url', {
        type: Sequelize.STRING,
        allowNull: false
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Materials', 'image_url');
    await queryInterface.removeColumn('Materials', 'name_url');
  }
};
