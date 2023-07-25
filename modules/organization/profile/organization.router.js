const router = require("express").Router();
const { createLabOrganization, getMyLab } = require("./organization.controller");
const { protect } = require("../../../middlewares/auth");

router.route("/").post(protect, createLabOrganization).get(protect, getMyLab);

module.exports = router;