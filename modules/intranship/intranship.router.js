const intranshipRoute = require("express").Router();
const intranshipController = require("./intranship.controller");
const authenticated = require('../../middlewares/isLoggedIn.middleware');

intranshipRoute.get('/intranships', authenticated, intranshipController.getAll);
intranshipRoute.get('/intranships/:id', authenticated, intranshipController.getById);
intranshipRoute.post('/add-intranship', authenticated, intranshipController.postIntranship);
intranshipRoute.put('/edit-intranship/:intranshipId', intranshipController.editIntranship);
intranshipRoute.delete('/delete-intranship/:intranshipId', authenticated, intranshipController.deleteIntranship);

module.exports = intranshipRoute;