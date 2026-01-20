'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('VideoFeedbacks');
    if(!tableDescription.duration){
      await queryInterface.addColumn('VideoFeedbacks', 'duration', {
        type: Sequelize.FLOAT,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('VideoFeedbacks', 'duration')
  }
};
