'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false
      },
      // Cột name: tên của khách hàng, kiểu chuỗi, không null
      name: { 
        type: Sequelize.STRING, 
        allowNull: false, 
      },
      // Cột phone: số điện thoại của khách hàng, kiểu chuỗi, không null
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // Cột address: địa chỉ quê quán của user, kiểu chuỗi, không null
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // Cột amount_of_orders: số lượng đơn hàng của khách hàng, kiểu số, không null
      amount_of_orders: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Customers')
  }
};
