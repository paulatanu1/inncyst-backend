const LabUserSchema = require("./lab-user.model");

const { ErrorResponse, SuccessResponse } = require("../../../utils");
const asyncHandler = require("../../../middlewares/async.middleware");
const sendTokenResponse = require("../../../utils/sendTokenResponse");

const LOGIN_TYPE = "labUser";

const registerLabUser = asyncHandler(async (req, res, next) => {
  const { email, phone, password, labname, role } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide all details to register", 400)
    );
  }

  let organization = await LabUserSchema.create({
    labname,
    email,
    phone,
    password,
  });

  const token = organization.getSignedJwtToken();

  organization = await LabUserSchema.findByIdAndUpdate(
    organization._id,
    { $push: { tokens: { token, timestamps: Date.now() } } },
    { new: true, upsert: true }
  );

  sendTokenResponse(token, 201, res, LOGIN_TYPE);
});

const labSignin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide valid email or password", 400)
    );
  }

  let labUser = await LabUserSchema.findOne({ email }).select("+password");

  if (labUser.tokens.length > 2) {
    return next(
      new ErrorResponse(
        "Invalid organization - You are already logged into 2 devices",
        401
      )
    );
  }

  if (!labUser) {
    return next(
      new ErrorResponse("Invalid organization - Please register", 401)
    );
  }

  const isMatch = await labUser.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  const token = labUser.getSignedJwtToken();

  labUser = await LabUserSchema.findByIdAndUpdate(
    labUser._id,
    { $push: { tokens: { token, timestamps: Date.now() } } },
    { new: true, upsert: true }
  );

  sendTokenResponse(token, 201, res, LOGIN_TYPE, {
    firstTimeUser: labUser.firstTimer && labUser.role === "admin",
  });
});

const labLogout = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  await LabUserSchema.findByIdAndUpdate(
    req.user.id,
    { $pull: { tokens: { token } } },
    { new: true, upsert: true }
  );

  return res.status(201).clearCookie("Authorization").clearCookie("Role").json({
    data: [],
    success: true,
  });
});

const getAllLabMembers = asyncHandler(async (req, res, next) => {
  const query = req.query;
  const members = await LabUserSchema.find(query);
  return res.status(201).json(new SuccessResponse("success", members));
});

module.exports = {
  registerLabUser,
  labSignin,
  labLogout,
  getAllLabMembers,
};
