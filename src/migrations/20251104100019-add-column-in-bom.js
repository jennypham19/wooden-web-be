'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('BOMs');
    if(!tableDescription.order_id){
      await queryInterface.addColumn('BOMs', 'order_id', {
        type: Sequelize.UUID,
        references: {
          model: 'Orders', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('BOMs', 'order_id')
  }
};
