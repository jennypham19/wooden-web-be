'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable("Menus");
    if(!tableDescription.is_actived){
      await queryInterface.addColumn("Menus", "is_actived", {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Menus", "is_actived")
  }
};
