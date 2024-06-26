const adminRouter = require('express').Router();
const adminController = require('./admin.controller');

adminRouter.post('/add-content', adminController.addContent);
adminRouter.put('/update-content/:id', adminController.updateContent);

module.exports = adminRouter;