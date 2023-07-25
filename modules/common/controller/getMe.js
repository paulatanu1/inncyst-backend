const chooseUserSchema = require("../chooseSchema");
const asyncHandler = require("../../../middlewares/async.middleware");

const getMe = asyncHandler(async (req, res, next) => {
  const Schema = chooseUserSchema(req.userType);
  const userInfo = await Schema.findById(req.user.id);

  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

module.exports = getMe;
