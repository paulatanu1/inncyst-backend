const router = require("express").Router();
const {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} = require("./inventory.controller");
const { protect } = require("../../../middlewares/auth");

router.get("/", protect, getInventory);
router.post("/", protect, createInventory);
router.put("/", protect, updateInventory);
router.delete("/", protect, deleteInventory);

module.exports = router;
