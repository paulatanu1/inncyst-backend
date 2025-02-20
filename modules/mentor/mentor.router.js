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

router.get('/mentor-skills', isLogged, Mentor.skillsList);
router.post('/mentor-skills-post', isLogged, Mentor.skillsAddOrUpdate);

router.post('/mentor-education', isLogged, Mentor.addEducationMentor);
router.get('/mentor-education-list', isLogged, Mentor.getEducationList);
router.get('/education/:id', isLogged, Mentor.getEducationById);
router.delete('/delete-mentor-education/:id', isLogged, Mentor.deleteMentorEdu);
router.put('/edit-mentor-education/:id', isLogged, Mentor.getEducationEdit);

module.exports = router;