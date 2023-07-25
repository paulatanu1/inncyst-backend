const router = require("express").Router();
const {
  sendTestRequest,
  getTestRequest
} = require("./test-request.controller");
const { protect } = require("../../../../middlewares/auth");

router
  .route("/test-request")
  .post(protect, sendTestRequest)
  .get(protect, getTestRequest);

module.exports = router;
