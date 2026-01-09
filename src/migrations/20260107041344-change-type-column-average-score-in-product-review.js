'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('ProductReviews');
    if(tableDescription.average_score){
      await queryInterface.changeColumn('ProductReviews', 'average_score', {
        type: Sequelize.STRING,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('ProductReviews', 'average_score', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
  }
};
