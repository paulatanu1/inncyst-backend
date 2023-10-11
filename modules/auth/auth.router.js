const router = require("express").Router();
const {
  register,
  profile,
  login,
  getMe,
  editProfile,
  uploadProfilePicture,
  changePassword,
  forgetPassword,
  verifyEmailOtp,
  setNewPassword,
  verifyAccount,
  resetEmailOtp,
  resetPhoneOtp,
  uploadPortfolio
} = require("./auth.controller");
const isLogged = require("../../middlewares/isLoggedIn.middleware");

router.post("/register", register);
router.get("/profile/:id", profile);
router.post("/login", login);
router.get("/me", isLogged, getMe);
router.put("/edit-profile", isLogged, editProfile);
router.post("/profile-image", isLogged, uploadProfilePicture);
router.post("/change-password", isLogged, changePassword);
router.post("/forget-password", forgetPassword);
router.post("/email-otp-verify", verifyEmailOtp);
router.put("/change-forget-password", setNewPassword);
router.post("/verify", verifyAccount);
router.put("/reset-email-otp", resetEmailOtp);
router.put("/reset-phone-otp", resetPhoneOtp);
router.post("/user/portfolio", isLogged, uploadPortfolio);

module.exports = router;
