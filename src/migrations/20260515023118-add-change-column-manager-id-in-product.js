'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Products');
    if(tableDescription.manager_id){
      await queryInterface.changeColumn('Products', 'manager_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'manager_id', {
      type: Sequelize.UUID,
      allowNull: true
    })
  }
};
