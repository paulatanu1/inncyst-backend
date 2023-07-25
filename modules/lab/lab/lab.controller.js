const Lab = require("./lab.model");
const RequestLabpool = require("../../organization/request/request.model");

const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");

const onBoardAlab = asyncHandler(async (req, res, next) => {
  
});

const createLab = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  if (!userId) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  return res.status(201).send({
    status: true,
    data: [],
  });
});

const addTechnician = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { labId, technician } = req.body;
  if (!userId || !labId) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  return res.status(201).send({
    status: true,
    data: lab,
  });
});

const getLabs = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { profileId } = req.params;
  if (!userId || !profileId) {
    return next(new ErrorResponse("Missing fields", 400));
  }
  const lab = await Lab.findOne({ profileId, user: userId });
  return res.status(201).send({
    status: true,
    data: lab,
  });
});

module.exports = { createLab, getLabs, addTechnician, onBoardAlab };
