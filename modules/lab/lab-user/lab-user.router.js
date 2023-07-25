const router = require("express").Router();
const { registerLabUser, getAllLabMembers, labSignin, labLogout } = require("./lab-user.controller");
const { protect } = require("../../../middlewares/auth");

router.route("/register").post(registerLabUser);
router.route("/signin").post(labSignin);
router.route("/logout").post(protect, labLogout);
router.route("/get-all-users").get(protect, getAllLabMembers);

module.exports = router;