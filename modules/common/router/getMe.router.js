const router = require("express").Router();
const getMe = require("../controller/getMe");
const {protect} = require("../../../middlewares/auth");

router.get("/getMe", protect, getMe);

module.exports = router;
