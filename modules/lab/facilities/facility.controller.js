const Facilities = require("./facility.model");
const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");

const createFacility = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { profileId, labId } = req.body;
  if (!userId || !profileId || !labId) {
    return next(new ErrorResponse("Missing fields", 400));
  }
  const lab = await Facilities.create({ ...req.body, user: userId });
  return res.status(201).send({
    status: true,
    data: lab,
  });
});

const getFacilities = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { profileId, labId } = req.params;
  if (!userId || !profileId || !labId) {
    return next(new ErrorResponse("Missing fields", 400));
  }
  const lab = await Facilities.findOne({ profileId, user: userId });
  return res.status(201).send({
    status: true,
    data: lab,
  });
});

module.exports = { createFacility, getFacilities };
