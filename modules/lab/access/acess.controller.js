const Access = require("./access.model");
const { ErrorResponse, SuccessResponse } = require("../../../utils");
const asyncHandler = require("../../../middlewares/async.middleware");
const allPermissions = require("../../common/permissions");

const createAccess = asyncHandler(async (req, res, next) => {
  const { role, permissions } = req.body;
  const access = await Access();

  return res.status(201).send();
});

const getAllPermissions = asyncHandler(async (req, res, next) => {
  return res.status(200).json(allPermissions);
});

module.exports = { createAccess, getAllPermissions };
