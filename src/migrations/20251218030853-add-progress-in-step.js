'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Steps');
    if(!tableDescription.progress){
      await queryInterface.addColumn('Steps', 'progress', {
        type: Sequelize.ENUM('0%', '20%', '40%', '60%', '80%', '100%'),
        allowNull: false,
        defaultValue: '0%'
      })
    }
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('Steps', 'progress');
  }
};
