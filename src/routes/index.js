// src/routes/v1/index.js
const express = require('express');

// Import các file route riêng lẻ
const authRoute = require('../routes/auth.route');
const permissionRoute = require('../routes/permission.route');
const uploadRoute = require('../routes/upload.route');
const userRoute = require('../routes/user.route');
const customerRoute = require('../routes/customer.route');

const router = express.Router();

// Tạo một mảng chứa các route và đường dẫn của chúng
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/permissions',
    route: permissionRoute
  },
  {
    path: '/image',
    route: uploadRoute
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/customers',
    route: customerRoute
  }
]

// Dùng vòng lặp để gắn tất cả các route vào router chính
defaultRoutes.forEach((routeEntry) => {
    router.use(routeEntry.path, routeEntry.route);
})

// Bạn có thể thêm các route chỉ dành cho môi trường development ở đây nếu cần
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

module.exports = router;