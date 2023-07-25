const {
  register,
  signin,
  getMe,
  getAllRegisteredUsers,
  logout,
} = require("../user/user.controller");
const { protect, authorize } = require("../../../middlewares/auth");

const router = require("express").Router();

router.get("/me", protect, getMe);
router.post("/signin", signin);
router.post("/register", register);
router.get("/logout", protect, logout);
router.get(
  "/get-all-users",
  protect,
  authorize("admin"),
  getAllRegisteredUsers
);

module.exports = router;
