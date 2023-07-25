const studentRouter = require("express").Router();
const studentController = require("./student.controller");
const authenticated = require('../../middlewares/isLoggedIn.middleware');

studentRouter.post('/apply-intranship', authenticated, studentController.applyIntranship);

module.exports = studentRouter;