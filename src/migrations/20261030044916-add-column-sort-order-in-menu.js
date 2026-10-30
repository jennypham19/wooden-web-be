'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Menus');
    if(!tableDescription.sort_order){
      await queryInterface.addColumn('Menus', 'sort_order', {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Thứ tự hiển thị quyền'
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Menus', 'sort_order')
  }
};
