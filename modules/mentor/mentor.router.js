const router = require("express").Router();
const isLogged = require("../../middlewares/isLoggedIn.middleware");
const Mentor = require('./mentor.controller');

router.get('/mentor-about', isLogged, Mentor.getMentorAbout);
router.post('/submit-about', isLogged, Mentor.addOrUpdateAbout);

router.get('/mentor-contact', isLogged, Mentor.getMentorContact);
router.post('/contact-submit', isLogged, Mentor.addOrUpdateContact)

module.exports = router;