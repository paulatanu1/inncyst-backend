const contactRouter = require('express').Router();
const contactController = require('./contact.controller');

contactRouter.get('/contact-us', contactController.getAll);
contactRouter.post('/contact-us', contactController.postContactUs);
contactRouter.get('/contact-us/:id', contactController.getById)


module.exports = contactRouter;