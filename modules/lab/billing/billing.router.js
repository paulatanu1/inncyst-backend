const router = require("express").Router();
const { protect } = require("../../../middlewares/auth");
const {
  getExpenses,
  createExpenses,
  updateExpenses,
  deleteExpenses,
} = require("./expenses.controller");

router.get("/expenses", protect, getExpenses);
router.post("/expenses", protect, createExpenses);
router.put("/expenses", protect, updateExpenses);
router.delete("/expenses", protect, deleteExpenses);

module.exports = router;
