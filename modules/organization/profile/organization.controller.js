const LabOrganization = require("./organization.model");
const { ErrorResponse, SuccessResponse } = require("../../../utils");
const asyncHandler = require("../../../middlewares/async.middleware");

const createLabOrganization = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { companyName, workEmail, phoneNumber } = req.body;
  if (!companyName || !workEmail || !phoneNumber) {
    return next(new ErrorResponse("Missing fields", 400));
  }
  const lab = await LabOrganization.create({ ...req.body, user: id });
  return res.status(201).send({
    status: true,
    data: lab,
  });
});

const getMyLab = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    return next(new ErrorResponse("Missing used id", 400));
  }
  const lab = await LabOrganization.findOne({ user: id });
  return res.status(201).send({
    status: true,
    data: lab,
  });
});

module.exports = { createLabOrganization, getMyLab };
