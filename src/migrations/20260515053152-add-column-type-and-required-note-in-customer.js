'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Customers');
    if (!tableDescription.type) {
      await queryInterface.addColumn('Customers', 'type', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    };
    if (!tableDescription.required_note) {
      await queryInterface.addColumn('Customers', 'required_note', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    };
    if(tableDescription.address){
      await queryInterface.changeColumn('Customers', 'address', {
        type: Sequelize.TEXT,
        allowNull: false
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Customers', 'type');
    await queryInterface.removeColumn('Customers', 'required_note');
    await queryInterface.changeColumn('Customers', 'address', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
};
