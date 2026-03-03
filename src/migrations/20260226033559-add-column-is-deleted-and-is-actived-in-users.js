'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Users');
    if(!tableDescription.is_deleted){
      await queryInterface.addColumn('Users', 'is_deleted', {
        type: Sequelize.INTEGER,
        defaultValue: 1 // 1 là chưa xóa, -1 là đã xóa
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'is_deleted')
  }
};
