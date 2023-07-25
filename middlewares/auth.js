const jwt = require("jsonwebtoken");
const User = require("../modules/lab/user/user.model");
const OrganizationUser = require("../modules/organization/org-user/org-user.model");
const asyncHandler = require("./async.middleware");
const { ErrorResponse, SuccessResponse } = require("../utils");
const chooseUserSchema = require("../modules/common/chooseSchema");

// const userTypes = require("../modules/common/userType");

// const chooseUserSchema = (userType) => {
//   switch (userType) {
//     case userTypes.ORGANIZATION:
//       return OrganizationUser;
//     case userTypes.LAB:
//       return;
//     case userTypes.CUSTOMER:
//       return;
//     case userTypes.VENDOR:
//       return;
//   }
// };

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  let Schema;

  // switch (req.headers.role) {
  //   case "organization":
  //     Schema = OrganizationUser
  //     break;
  //   default:
  //     break;
  // }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access the route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded", decoded);
    Schema = chooseUserSchema(decoded.userType);
    req.user = await Schema.findById(decoded.id);
    req.userType = decoded.userType;
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access the route", 401));
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
