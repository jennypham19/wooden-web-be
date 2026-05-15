'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Orders');
    if (!tableDescription.manager_id) {
      await queryInterface.addColumn('Orders', 'manager_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'manager_id');
  }
};
