const router = require("express").Router();
const {
  createTalentProfile,
  updateTalentProfile,
  getTalentProfile,
} = require("./profile.controller");
const { protect } = require("../../../middlewares/auth");

router
  .route("/")
  .post(protect, createTalentProfile)
  .put(protect, updateTalentProfile)
  .get(protect, getTalentProfile);

module.exports = router;
