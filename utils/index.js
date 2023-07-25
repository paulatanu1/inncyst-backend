const { generateOTP } = require("./otpGenerator");
const { ErrorResponse } = require("./errorResponse");
const { SuccessResponse } = require("./successResponse");

module.exports = { generateOTP, ErrorResponse, SuccessResponse };
