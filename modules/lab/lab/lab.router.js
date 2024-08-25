const router = require("express").Router();
const { createLab, getLabs, onBoardAlab, labRegister } = require("./lab.controller");
const { protect } = require("../../../middlewares/auth");

// router.post("/", protect, createLab);
// router.get("/:profileId", protect, getLabs);
// router.get("/reference/:organization", onBoardAlab);

router.post('/register-lab', labRegister)

module.exports = router;
