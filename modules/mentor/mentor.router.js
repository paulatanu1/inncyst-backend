const router = require("express").Router();
const isLogged = require("../../middlewares/isLoggedIn.middleware");
const Mentor = require('./mentor.controller');

router.get('/mentor-about', isLogged, Mentor.getMentorAbout);
router.post('/submit-about', isLogged, Mentor.addOrUpdateAbout);

router.get('/mentor-contact', isLogged, Mentor.getMentorContact);
router.post('/contact-submit', isLogged, Mentor.addOrUpdateContact);

router.get('/mentor-exp', isLogged, Mentor.getAllMentorExpireances);
router.get('/expireance/:id', isLogged, Mentor.getMntorExpById);
router.delete('/exp-delete/:id', isLogged, Mentor.deleteMentorExp);
router.post('/add-exp', isLogged, Mentor.addMentorExpireance);
router.put('/update-exp/:id', isLogged, Mentor.updateMentorExpireance);

module.exports = router;