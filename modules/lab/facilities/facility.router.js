const router = require("express").Router();
const { createFacility, getFacilities } = require("./facility.controller");
const { protect } = require("../../../middlewares/auth");

router.post("/", protect, createFacility);
router.get("/:profileId/:labId", protect, getFacilities);

module.exports = router;
