'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('DimensionProducts');
    if(tableDescription.length){
      await queryInterface.changeColumn('DimensionProducts', 'length', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    };
    if(tableDescription.width){
      await queryInterface.changeColumn('DimensionProducts', 'width', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    };
    if(tableDescription.height){
      await queryInterface.changeColumn('DimensionProducts', 'height', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('DimensionProducts', 'length', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('DimensionProducts', 'width', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
    await queryInterface.changeColumn('DimensionProducts', 'height', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  }
};
