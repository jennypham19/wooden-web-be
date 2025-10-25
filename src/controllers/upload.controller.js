const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const uploadImageSingle = catchAsync(async (req, res) => {
        try {
            // Nếu không có file
            if(!req.file) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng chọn một file để upload.');
            }

            // ⚠️ log raw error
            if (!req.file.path) {
                console.error("Cloudinary upload failed. Full file object:", req.file);
                throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Upload lên Cloudinary thất bại.");
            }

            const imageUrl = req.file.path; // link ảnh Cloudinary
            const folder = req.body.type || 'wooden' // folder đã lưu
            const fileName = req.file.filename; // lấy tên ảnh
            // Sau khi upload thành công, multer-storage-cloudinary sẽ trả về link tại req.file.path
            res.status(StatusCodes.OK).send({
                success: true,
                message: 'Upload file thành công',
                data: {
                    file: {
                        imageUrl,
                        fileName
                    },
                    folder,
                }
            })
        } catch (error) {
            if(error instanceof ApiError) throw error;
            console.error("Upload error:", error); // log cụ thể lỗi
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi xảy ra ' + error.message);
        }
});

const uploadEmployeeImageMultiple = catchAsync(async (req, res) => {
        try {
            if(!req.files || req.files.length === 0){
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Vui lòng chọn một file để upload.');
            }
            const files = req.files.map(file => ({
                url: file.path,
                name: file.filename
            }));
            const folder = req.body.type || 'wooden' // folder đã lưu
            res.status(StatusCodes.OK).send({
                success: true,
                message: 'Upload file thành công',
                data: {
                    files,
                    folder,
                }
            })
        } catch (error) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Đã có lỗi xảy ra ' + error.message);
        }
});


module.exports = {
    uploadImageSingle,
    uploadEmployeeImageMultiple
}