const {
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("./customer.controller");
const { protect } = require("../../../middlewares/auth");
const router = require("express").Router();

router.get("/all", protect, getCustomer);

router
  .route("/")
  .post(protect, createCustomer)
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

module.exports = router;
