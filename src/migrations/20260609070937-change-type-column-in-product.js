'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Products');
    if(tableDescription.description){
      await queryInterface.changeColumn('Products', 'description', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    };
    if(tableDescription.target){
      await queryInterface.changeColumn('Products', 'target', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'description', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.changeColumn('Products', 'target', {
      type: Sequelize.TEXT,
      allowNull: false
    })
  }
};
