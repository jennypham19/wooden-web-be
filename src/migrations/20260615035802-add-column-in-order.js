'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Orders');
    if(!tableDescription.is_stored){
      await queryInterface.addColumn('Orders', 'is_stored', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    };
    if(!tableDescription.reason_storage){
      await queryInterface.addColumn('Orders', 'reason_storage', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    };
    if(!tableDescription.date_storage){
      await queryInterface.addColumn('Orders', 'date_storage', {
        type: Sequelize.DATE,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Order', 'is_stored');
    await queryInterface.removeColumn('Order', 'reason_storage');
    await queryInterface.removeColumn('Order', 'date_storage');
  }
};
