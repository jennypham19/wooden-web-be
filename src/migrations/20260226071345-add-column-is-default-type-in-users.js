'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('Users');
    if(!tableDescription.is_default_type){
      await queryInterface.addColumn('Users', 'is_default_type', {
        type: Sequelize.INTEGER,
        defaultValue: 1 // 1 được tạo tài khoản, -1 là tài khoản bị reset mật khẩu về mặc định, đăng nhập phải đổi mật khẩu
      })
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'is_default_type')
  }
};
