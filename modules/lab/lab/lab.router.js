const router = require("express").Router();
const { createLab, getLabs, onBoardAlab, labRegister, labLogin, changePassword } = require("./lab.controller");
const Authenticate = require("../../../middlewares/isLoggedInLab.middleware");

router.post('/register-lab', labRegister);
router.post('/login', labLogin);
router.post('/change-password', Authenticate, changePassword);

module.exports = router;
