'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Orders');
    if(tableDescription.required_note && tableDescription.required_note.allowNull === false){
      await queryInterface.changeColumn('Orders', 'required_note', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Orders', 'required_note', {
      type: Sequelize.TEXT,
      allowNull: false
    })
  }
};
