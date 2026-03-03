const twilio = require('twilio');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const { parsePhoneNumber } = require('libphonenumber-js');

const formatPhoneNumber = async(phoneNumber) => {
    const parsedNumber = parsePhoneNumber(phoneNumber, 'VN');  
  if (!parsedNumber || !parsedNumber.isValid()) {
    throw new Error('Số điện thoại không hợp lệ');
  }

  return parsedNumber.number; // Chuẩn E.164    
} 
const sendSMS = async(to, body) => {
    try {
        const formattedPhone = await formatPhoneNumber(to);
        const message = await client.messages.create({
            body: `${body} là mật khẩu đã được đặt lại. Vui lòng không chia sẻ mật khẩu này với bất kỳ ai và đổi mật khẩu ngay sau khi đăng nhập.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone
        });
        return message;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra khi gửi SMS: " + error.message)
    }
}

module.exports = {
    sendSMS
}