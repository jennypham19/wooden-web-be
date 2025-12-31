'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Thêm giá trị mới vào ENUM
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_WorkMilestones_evaluated_status" ADD VALUE IF NOT EXISTS 'not_reviewed'`
    );

    // 2. Đổi defaultValue
    await queryInterface.sequelize.query(
      `ALTER TABLE "WorkMilestones" ALTER COLUMN "evaluated_status" SET DEFAULT 'not_reviewed'`
    );

    // 3. Thêm trường version
    const tableDescription = await queryInterface.describeTable('WorkMilestones');
    if(!tableDescription.version){
      await queryInterface.addColumn('WorkMilestones', 'version', {
        type: Sequelize.INTEGER,
        defaultValue: 1
      })
    }
  },

  async down (queryInterface, Sequelize) {
    // PostgreSQL không hỗ trợ remove ENUM value

    // Set lại giá trị mặc định ban đầu 'pending'
    await queryInterface.sequelize.query(
      `ALTER TABLE "WorkMilestones" ALTER COLUMN "evaluated_status" SET DEFAULT 'pending'`
    );

    // remove column version
    await queryInterface.removeColumn('WorkMilestones', 'version')
  }
};
