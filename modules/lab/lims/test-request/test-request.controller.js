const TestRequest = require("./test-request.model");
const Customers = require("../../customer/customer.model");
const Forms = require("../../form/form.model");

const asyncHandler = require("../../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../../utils");
const sendEmail = require("../../../../config/email");

const sendTestRequest = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  if (!userId) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  const { selectedFormId, selectedCustomerId, status } = req.body;

  const testRequest = await TestRequest.create({
    selectedFormId,
    selectedCustomerId,
    status,
    user: userId,
  });

  return res.status(201).send({
    status: true,
    data: testRequest,
  });
});

const getTestRequest = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const testRequest = await TestRequest.find({ user: userId })
    .populate("selectedFormId")
    .populate("selectedCustomerId");

  return res.status(201).send({
    status: true,
    data: testRequest,
  });
});

module.exports = {
  sendTestRequest,
  getTestRequest,
};
