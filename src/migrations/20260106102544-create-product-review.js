'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ProductReviews', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Products', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
        overall_quality: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        aesthetics: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        customer_requirement: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        satisfaction: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        comment: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        average_score: {
            type: Sequelize.FLOAT,
            allowNull: true
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
    await queryInterface.dropTable('ProductReviews')
  }
};
