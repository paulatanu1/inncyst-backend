const studentRouter = require("express").Router();

const studentController = require("./student.controller");
const authenticated = require('../../middlewares/isLoggedIn.middleware');

studentRouter.post('/upload-resume', authenticated, studentController.uploadResume);
studentRouter.post('/upload-resume-demo', authenticated, studentController.uploadResumeDemo);
studentRouter.post('/apply-job', authenticated, studentController.applyIntranship);
studentRouter.get('/job-list', authenticated, studentController.getAll);
studentRouter.get('/job/:id', authenticated, studentController.getById);

// User Resume Form
studentRouter.post('/user-resume', authenticated, studentController.addUserResume);
studentRouter.get('/user-resume', authenticated, studentController.getUserResume);
studentRouter.put('/user-resume/:id', authenticated, studentController.updateUserResume);
studentRouter.delete('/user-resume/:id', authenticated, studentController.deleteUserResume);

// Student Achivement routes
studentRouter.post('/student-achivement', authenticated, studentController.addAchivement);
studentRouter.get('/student-achivement', authenticated, studentController.achivementlist);
studentRouter.get('/student-achivement/:id', authenticated, studentController.achivementById);
studentRouter.put('/student-achivement/:id', authenticated, studentController.achivementEdit);
studentRouter.delete('/student-achivement/:id', authenticated, studentController.achivementDelete);

module.exports = studentRouter;