'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('DefectDetails', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true
      },
      issue_report_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'IssueReports', key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
        /*
        - dimesion: sai kích thước
        - design: sai bản vẽ
        - material: lỗi vật liệu
        - machine: lỗi máy móc
        - workmanship: tay nghề
        - installing: lỗi lắp đặt
        - labor_safety: an toàn lao động
        */
      defect_type: {
        type: Sequelize.ENUM('dimension', 'design', 'material', 'machine', 'workmanship', 'installing', 'labor_safety', 'other'),
        allowNull: true
      },
      defect_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      root_cause: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('DefectDetails')
  }
};
