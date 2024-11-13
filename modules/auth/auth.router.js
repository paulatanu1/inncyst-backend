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
  uploadPortfolio,
  updatePortfolio,
  portFolioData,
  deletePortfolio,
  getById,
  socialLogin,
  socialMobileVerify,
  verifyPhoneOtp
} = require("./auth.controller");
const isLogged = require("../../middlewares/isLoggedIn.middleware");

router.post("/register", register);
router.get("/profile/:id", profile);
router.post("/login", login);
router.post('/social/login', socialLogin);
router.post('/verify-social-phone', socialMobileVerify)
router.get("/me", isLogged, getMe);
router.put("/edit-profile", isLogged, editProfile);
router.post("/profile-image", isLogged, uploadProfilePicture);
router.post("/change-password", isLogged, changePassword);
router.post("/forget-password", forgetPassword);
router.post("/email-otp-verify", verifyEmailOtp);
router.post("/phone-otp-verify", verifyPhoneOtp);
router.put("/change-forget-password", setNewPassword);
router.post("/verify", verifyAccount);
router.put("/reset-email-otp", resetEmailOtp);
router.put("/reset-phone-otp", resetPhoneOtp);

// Portfolio
router.get("/user/portfolio", isLogged, portFolioData);
router.post("/user/portfolio", isLogged, uploadPortfolio);
router.get("/user/portfolio/:id", isLogged, getById);
router.put("/user/portfolio/:id", isLogged, updatePortfolio);
router.delete("/user/portfolio/:id", isLogged, deletePortfolio);

module.exports = router;
