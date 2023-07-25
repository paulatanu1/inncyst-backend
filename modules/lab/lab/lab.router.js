const router = require("express").Router();
const { createLab, getLabs, onBoardAlab } = require("./lab.controller");
const { protect } = require("../../../middlewares/auth");

router.post("/", protect, createLab);
router.get("/:profileId", protect, getLabs);
router.get("/reference/:organization", onBoardAlab);

module.exports = router;
