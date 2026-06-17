'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Steps');
    if(!tableDescription.reason_deleted_image_step){
      await queryInterface.addColumn('Steps', 'reason_deleted_image_step', {
        type: Sequelize.STRING,
        allowNull: true
      })
    };
    if(!tableDescription.date_deleted_image_step){
      await queryInterface.addColumn('Steps', 'date_deleted_image_step', {
        type: Sequelize.DATE,
        allowNull: true
      })
    };
    if(!tableDescription.manager_deleted_id){
      await queryInterface.addColumn('Steps', 'manager_deleted_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    };
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Steps', 'reason_deleted_image_step');
    await queryInterface.removeColumn('Steps', 'date_deleted_image_step');
    await queryInterface.removeColumn('Steps', 'manager_deleted_id');
  }
};
