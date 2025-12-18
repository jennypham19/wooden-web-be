'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('WorkOrders');
    if(!tableDescription.order_id){
      await queryInterface.addColumn('WorkOrders', 'order_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Orders', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('WorkOrders', 'order_id');
  }
};
