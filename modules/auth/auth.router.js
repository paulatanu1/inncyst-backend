const router = require("express").Router();
const { register, login, getMe, uploadProfilePicture, changePassword, verifyAccount, resetEmailOtp, resetPhoneOtp } = require("./auth.controller");
const isLogged = require('../../middlewares/isLoggedIn.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', isLogged, getMe);
router.post('/profile-image', isLogged, uploadProfilePicture);
router.post('/change-password', isLogged, changePassword);
router.post('/verify', verifyAccount);
router.put('/reset-email-otp', resetEmailOtp);
router.put('/reset-phone-otp', resetPhoneOtp);

module.exports = router;