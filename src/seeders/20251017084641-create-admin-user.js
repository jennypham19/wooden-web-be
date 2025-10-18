'use strict';
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableName = 'Users';
    const adminEmail = 'admin@gmail.com';
    const existingAdmin = await queryInterface.sequelize.query(
      `SELECT email from "${tableName}" WHERE email = :email LIMIT 1`,
      {
        replacements: { email: adminEmail },
        type: Sequelize.QueryTypes.SELECT,
        plain: true
      }
    );

    if(!existingAdmin) {
      // Băm mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);

      await queryInterface.bulkInsert(tableName, [{
        id: uuidv4(),
        email: adminEmail,
        password: hashedPassword,
        full_name: 'Quản trị viên',
        dob: '1980-10-17 08:54:03+00',
        code: 'A 001578',
        gender: 'female',
        phone: '0987562471',
        work: 'Quản lý tất cả tài khoản cũng như việc phân quyền',
        department: 'null',
        avatar_url: 'null',
        name_image: 'null',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
      console.log(`Successfully inserted initial admin user: '${adminEmail}'`);
    }else {
      console.log(`Initial admin user '${adminEmail}' already exists. Skipping.`);
    }
  },

  async down (queryInterface, Sequelize) {
    // Giữ nguyên logic down, nó đã đúng
    await queryInterface.bulkDelete('Users', { email: 'admin@gmail.com' });
    console.log(`Successfully deleted initial admin user: 'admin@gmail.com'`);
  }
};
