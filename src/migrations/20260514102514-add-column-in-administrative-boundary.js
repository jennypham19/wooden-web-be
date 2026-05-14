'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('AdministrativeBoundaries');
    if(!tableDescription.directly_under) {
      await queryInterface.addColumn('AdministrativeBoundaries', 'directly_under', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('AdministrativeBoundaries', 'directly_under')
  }
};
