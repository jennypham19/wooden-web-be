// src/middlewares/upload.js
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v4: uuidv4 } = require("uuid");
const crypto = require('crypto');

// ========== Hàm lấy resource_type cho Cloudinary ==========
const getCloudinaryResourceType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  // PDF, DOC, DOCX, ZIP, TXT, CSV, JSON => raw
  return "raw";
};

// Lưu trực tiếp vào Cloudinary với folder động
const storage = new CloudinaryStorage({
  cloudinary,
  params:(req, file) => {
    // mặc định folder gốc
    let folder = "wooden";
    //Nếu gửi lên kèm theo type => tạo folder con theo type
    // ví dụ req.body.type = 'employees' => wooden/employees
    if (req.body.type) {
      folder = `${folder}/${req.body.type}`;
    }else {
      console.warn("⚠️ req.body.type missing, fallback to museum/");
    }

    // Lấy tên gốc không đuôi
    let baseName = path.parse(file.originalname).name;

    // sanitize tên: chỉ cho phép chữ, số, dấu gạch ngang và gạch dưới
    baseName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
    const fileHash = crypto.createHash("md5").update(baseName).digest("hex");

    // LẤY ĐUÔI FILE: .pdf, .doc, .docx
    const ext = path.extname(file.originalname);

    return {
      folder,
      resource_type: getCloudinaryResourceType(file.mimetype),
      use_filename: true, // giữ tên gốc của file
      unique_filename: false, // không thêm chuỗi random vào
      public_id: `${baseName}_${fileHash}${ext}`, // lồng originalname vào public_id
      overwrite: false, // nếu trùng báo lỗi,
      type: "upload"
    }
  }
})

const upload = multer({
  storage: storage,
  // Giới hạn size CHUẨN (multer tự kiểm tra)
  limits: {
    fileSize: 100 * 1024 * 1024, // Giới hạn chung 100MB (Cloudinary free cũng max ~100MB)
  },
  // Chặn những file không cho phép
  fileFilter: (req, file, cb) => {
    const allowedDocs  = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const allowedRaw = [
      "application/zip",
      "application/x-rar-compressed",
      "text/plain",
      "application/json",
      "text/csv"
    ];

    if (file.mimetype.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        return cb(
          new ApiError(StatusCodes.BAD_REQUEST, "Ảnh vượt quá dung lượng 5MB!"),
          false
        );
      }
      return cb(null, true);
    } else if (file.mimetype.startsWith("video/")) {
      if (file.size > 100 * 1024 * 1024) {
        return cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Video vượt quá dung lượng 100MB!"
          ),
          false
        );
      }
      return cb(null, true);
    } else if (allowedRaw.includes(file.mimetype)) {
      if (file.size > 10 * 1024 * 1024) {
        return cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "File PDF vượt quá dung lượng 10MB!"
          ),
          false
        );
      }
      return cb(null, true);
    } else if (allowedDocs.includes(file.mimetype)) {
      if (file.size > 10 * 1024 * 1024) {
        return cb(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "File DOC, DOCX vượt quá dung lượng 10MB!"
          ),
          false
        );
      }
      return cb(null, true);
    } else {
      return cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Chỉ cho phép upload file ảnh, PDF, DOC, DOCX hoặc video!"
        ),
        false
      );
    }
  },
});

module.exports = upload;