const Users = require("./user.model");
const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  return res
    .status(statusCode)
    .cookie("Authorization", `Bearer ${token}`, options)
    .json({
      data: { token, isFirstTime: user.isFirstTime, category: user.category },
      success: true,
    });
};

const register = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return next(
      new ErrorResponse("Please provide all details to register", 400)
    );
  }

  const user = await Users.create({ name, email, phone, password });

  sendTokenResponse(user, 201, res);
});

const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("password", password)
  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide valid email or password", 400)
    );
  }

  const user = await Users.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid User - Please register", 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  sendTokenResponse(user, 201, res);
});

const logout = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  if (!id) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  await Users.findByIdAndUpdate(
    {
      _id: id,
    },
    { isFirstTime: false },
    { new: true }
  );

  return res
    .status(200)
    .send(new SuccessResponse("Logged you out successfully"));
});

const getMe = asyncHandler(async (req, res, next) => {
  const user = await Users.findById(req.user.id);

  return res.status(200).json({
    success: true,
    data: user,
  });
});

const getAllRegisteredUsers = asyncHandler(async (req, res, next) => {
  const users = await Users.find();
  return res
    .status(200)
    .send(new SuccessResponse("ok", Array.isArray(users) ? users : [users]));
});

module.exports = { register, signin, getAllRegisteredUsers, getMe, logout };
