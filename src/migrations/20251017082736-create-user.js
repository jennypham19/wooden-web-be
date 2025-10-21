'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Bật extension pgcrypto nếu chưa có (để tạo UUID)
    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    await queryInterface.createTable('Users', {
        // id của user, kiểu UUID, khóa chính, không null, sự sinh UUID v4 khi tạo mới
        id: { 
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'), // Nếu dùng PostgreSQL, tạo UUID bằng pgcrypto
            // hoặc với MySQL: Sequelize.literal('(UUID())')
            primaryKey: true,
            allowNull: false
        },
        // Cột email: email của user, kiểu chuỗi, không null, là duy nhất
        email: { 
            type: Sequelize.STRING, 
            allowNull: false, 
            unique: true 
        },
        // Cột password: mật khẩu của user, kiểu chuỗi, không null
        password: { 
            type: Sequelize.STRING, 
            allowNull: false 
        },
        // Cột full_name: họ tên của user, kiểu chuỗi, không null
        full_name: { 
            type: Sequelize.STRING, 
            allowNull: false 
        },
        // Cột role: chức vụ của user, không null, mặc định là carpenter (thợ mộc)
        role: {
            type: Sequelize.ENUM('admin', 'factory_manager', 'production_planner', 'production_supervisor', 'carpenter', 'qc', 'inventory_manager', 'technical_design', 'accounting'),
            allowNull: false,
            defaultValue: 'carpenter'
        },
        // Cột dob: ngày sinh của user, kiểu ngày tháng, không null
        dob: {
            type: Sequelize.DATE,
            allowNull: false
        },
        // Cột code: mã của user, kiểu chuỗi, không null
        code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột gender: giới tính của user, kiểu chuỗi, không null
        gender: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột phone: số điện thoại của user, kiểu chuỗi, không null
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        // Cột work: công việc của user, kiểu chuỗi, không null
        work: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột department: phòng ban của user, kiểu chuỗi, không null
        department: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột address: địa chỉ quê quán của user, kiểu chuỗi, có thể null
        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        // Cột avatar_url: đường link ảnh đại diện của user, kiểu chuỗi, không null
        avatar_url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột name_image: tên ảnh đại diện của user, kiểu chuỗi, không null
        name_image: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // Cột is_active: trạng thái kích hoạt của user, kiểu boolean, mặc định là true
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true // true là đã kích hoạt, false là vô hiệu hóa
        },
        // Cột is_reset: trạng thái reset mật khẩu của user, kiểu boolean, mặc định là false
        is_reset: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false // true là đã reset, false là không
        },
        // Cột createdAt: ngày tạo, kiểu ngày tháng, không null
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        // Cột updatedAt: ngày chỉnh sửa, kiểu ngày tháng, không null
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  }
};
