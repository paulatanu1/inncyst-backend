const router = require("express").Router();
const { getRole, createRole } = require("./roles.controller");
const { protect } = require("../../../middlewares/auth");

router.get("/", protect, getRole);
router.post("/", protect, createRole);

module.exports = router;
