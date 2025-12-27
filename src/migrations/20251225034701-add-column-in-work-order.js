'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('WorkOrders');
    if(!tableDescription.evaluated_status){
      await queryInterface.addColumn('WorkOrders', 'evaluated_status', {
        type: Sequelize.ENUM('pending', 'rework', 'approved'),
        allowNull: false,
        defaultValue: 'pending'
      })
    };
    if(!tableDescription.evaluation_description){
      await queryInterface.addColumn('WorkOrders', 'evaluation_description', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('WorkOrders', 'evaluated_status');
    await queryInterface.removeColumn('WorkOrders', 'evaluation_description');
  }
};
