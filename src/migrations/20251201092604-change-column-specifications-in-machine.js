'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Machines');
    if(tableDescription.specifications){
      await queryInterface.changeColumn('Machines', 'specifications', {
        type: Sequelize.STRING,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Machines', 'specifications', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
};
