const paymentRouter = require("express").Router();
const checkPermission = require('../../middlewares/user.authenticate');
const paymentController = require('./payment.controller');
const Authenticate = require("../../middlewares/isLoggedIn.middleware");

paymentRouter.post('/create-plan', Authenticate, checkPermission('admin'), paymentController.createPlan);

module.exports = paymentRouter;
