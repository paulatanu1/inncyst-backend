const Organization = require("./org-user.model");
const LabUser = require("../../lab/lab-user/lab-user.model");
const { ErrorResponse, SuccessResponse } = require("../../../utils");
const asyncHandler = require("../../../middlewares/async.middleware");
const sendTokenResponse = require("../../../utils/sendTokenResponse");
var randomstring = require("randomstring");
const userType  = require("../../common/userType");
const LOGIN_TYPE = "organization";
const Users = require("../../lab/user/user.model");

const registerOrganization = asyncHandler(async (req, res, next) => {
  const { username, email, phone, password, orgname, role, labname, name } = req.body;
  if (role === userType.LAB) {
    const LOGIN_TYPE = "labUser";
    let organization = await LabUser.create({
      labname,
      email,
      phone,
      password,
    });
  
    const token = organization.getSignedJwtToken();
  
    await LabUser.findByIdAndUpdate(
      organization._id,
      { $push: { tokens: { token, timestamps: Date.now() } } },
      { new: true, upsert: true }
    );
  
    return sendTokenResponse(token, 201, res, LOGIN_TYPE);
  }

  if (role === 'organization') {
    if (!username || !email || !password) {
      return next(
        new ErrorResponse("Please provide all details to register", 400)
      );
    }
  let organization = await Organization.create({
    orgname,
    username,
    email,
    phone,
    password,
  });

  const token = organization.getSignedJwtToken();

  organization = await Organization.findByIdAndUpdate(
    organization._id,
    { $push: { tokens: { token, timestamps: Date.now() } } },
    { new: true, upsert: true }
  );

  return sendTokenResponse(token, 201, res, LOGIN_TYPE);
  }

  if (!name || !email || !password) {
    return next(
      new ErrorResponse("Please provide all details to register", 400)
    );
  }

  const user = await Users.create({ name, email, phone, password });

  return sendTokenResponse(user, 201, res);
});

const organizationSignin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide valid email or password", 400)
    );
  }

  let organization = await Organization.findOne({ email }).select("+password");

  if (organization.tokens.length > 20) {
    return next(
      new ErrorResponse(
        "Invalid organization - You are already logged into 2 devices",
        401
      )
    );
  }

  if (!organization) {
    return next(
      new ErrorResponse("Invalid organization - Please register", 401)
    );
  }

  const isMatch = await organization.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  const token = organization.getSignedJwtToken();

  organization = await Organization.findByIdAndUpdate(
    organization._id,
    { $push: { tokens: { token, timestamps: Date.now() } } },
    { new: true, upsert: true }
  );

  sendTokenResponse(token, 201, res, LOGIN_TYPE);
});

const organizationLogout = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  await Organization.findByIdAndUpdate(
    req.user.id,
    { $pull: { tokens: { token } } },
    { new: true, upsert: true }
  );

  return res.status(201).clearCookie("Authorization").clearCookie("Role").json({
    data: [],
    success: true,
  });
});

const inviteLabOwners = asyncHandler(async (req, res, next) => {
  const { labname, email, fname, lname } = req.body;
  const password = randomstring.generate(8);
  const role = "admin";
  console.log("reached")
  // TODO: Add logic for sending mail
  await LabUser.create({
    labname,
    email,
    fname,
    lname,
    password,
    temporaryPassword: password,
    role
  });

  return res
    .status(201)
    .send(new SuccessResponse("Successfully sent invitation to user", []));
});

module.exports = {
  registerOrganization,
  organizationSignin,
  organizationLogout,
  inviteLabOwners,
};
