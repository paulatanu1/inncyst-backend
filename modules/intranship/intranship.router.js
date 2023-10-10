const intranshipRoute = require("express").Router();
const intranshipController = require("./intranship.controller");
const authenticated = require('../../middlewares/isLoggedIn.middleware');

intranshipRoute.get('/jobs', authenticated, intranshipController.getAll);
intranshipRoute.get('/jobs/:id', intranshipController.getById);
intranshipRoute.post('/add-job', authenticated, intranshipController.postIntranship);
intranshipRoute.put('/edit-job/:jobId', intranshipController.editIntranship);
intranshipRoute.delete('/delete-job/:jobId', authenticated, intranshipController.deleteIntranship);
intranshipRoute.get('/all-jobs', intranshipController.getAllIntranship);

module.exports = intranshipRoute;