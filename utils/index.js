const { generateOTP } = require("./otpGenerator");
const { ErrorResponse } = require("./errorResponse");
const { SuccessResponse } = require("./successResponse");
const { getImageExtension } = require("./fileExtentionFromBase64");

module.exports = { generateOTP, ErrorResponse, SuccessResponse, getImageExtension };
