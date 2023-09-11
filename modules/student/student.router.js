const studentRouter = require("express").Router();

const studentController = require("./student.controller");
const authenticated = require('../../middlewares/isLoggedIn.middleware');

studentRouter.post('/upload-resume', authenticated, studentController.uploadResume);
studentRouter.post('/apply-job', authenticated, studentController.applyIntranship);
studentRouter.get('/job-list', authenticated, studentController.getAll);
studentRouter.get('/job/:id', authenticated, studentController.getById);

module.exports = studentRouter;