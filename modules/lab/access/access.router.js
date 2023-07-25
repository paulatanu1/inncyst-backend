const router = require("express").Router();
const { protect } = require("../../../middlewares/auth");
const { getAllPermissions } = require("./acess.controller");

router.route("/permissions-list").get(protect, getAllPermissions);

module.exports = router;
