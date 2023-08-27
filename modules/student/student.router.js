const studentRouter = require("express").Router();

const studentController = require("./student.controller");
const authenticated = require('../../middlewares/isLoggedIn.middleware');

studentRouter.post('/apply-intranship', authenticated, studentController.applyIntranship);
studentRouter.get('/intranship-list', authenticated, studentController.getAll);
studentRouter.get('/intranship/:id', authenticated, studentController.getById);

module.exports = studentRouter;