const router = require("express").Router();
const {
  registerOrganization,
  organizationSignin,
  organizationLogout,
  inviteLabOwners,
} = require("./org-user.controller");
const { protect } = require("../../../middlewares/auth");

router.route("/register").post(registerOrganization);
router.route("/signin").post(organizationSignin);
router.route("/logout").post(protect, organizationLogout);
router.route("/invite").post(protect, inviteLabOwners);

module.exports = router;
