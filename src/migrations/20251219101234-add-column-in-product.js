'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Products');
    if(!tableDescription.name_image){
      await queryInterface.addColumn('Products', 'name_image', {
        type: Sequelize.STRING,
        allowNull: true
      })
    };
    if(!tableDescription.url_image){
      await queryInterface.addColumn('Products', 'url_image', {
        type: Sequelize.STRING,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'name_image');
    await queryInterface.removeColumn('Products', 'url_image')
  }
};
