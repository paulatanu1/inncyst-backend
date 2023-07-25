const router = require("express").Router();
const { createForm, updateForm, getForm } = require("./form.controller");
const { protect } = require("../../../middlewares/auth");

router.get("/all/", protect, getForm)

router
  .route("/")
  .get(protect, getForm)
  .post(protect, createForm)
  .put(protect, updateForm);

module.exports = router;
