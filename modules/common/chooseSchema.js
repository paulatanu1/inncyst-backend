const OrganizationUserSchema = require("../organization/org-user/org-user.model");
const LabUserSchema = require("../lab/lab-user/lab-user.model");

const userTypes = require("./userType");

const chooseUserSchema = (userType) => {
  switch (userType) {
    case userTypes.ORGANIZATION:
      return OrganizationUserSchema;
    case userTypes.LAB:
      return LabUserSchema;
    case userTypes.CUSTOMER:
      return;
    case userTypes.VENDOR:
      return;
  }
};

module.exports = chooseUserSchema