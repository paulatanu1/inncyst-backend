const Role = require("./roles.model");

const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");

const getRole = asyncHandler(async (req, res, next) => {
  let data = await Role.find({});
  return res.json(data);
});

const createRole = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  let { identifier, permission } = req.body;

  if (!userId) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  let role = await Role.create({
    identifier,
    permission,
  });

  return res.status(201).send({
    status: true,
    data: role,
  });
});

module.exports = {
  getRole,
  createRole,
};
