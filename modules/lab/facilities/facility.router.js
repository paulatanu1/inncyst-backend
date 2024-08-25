const router = require("express").Router();
const { createFacility, getFacilities, getFacilitiesForUser, updateFacility } = require("./facility.controller");
const Authenticate = require("../../../middlewares/isLoggedInLab.middleware");

router.post("/create-facility", Authenticate, createFacility);
router.get("/facility-list", Authenticate, getFacilities);
router.get("/facility-for-user", getFacilitiesForUser);
router.put("/facility-update/:facilityId", Authenticate, updateFacility);

module.exports = router;
