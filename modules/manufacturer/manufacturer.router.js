const router = require("express").Router();
const {manufacturerQuestions} = require('./maufacturer.controller');

router.post('/manufacturer-question', manufacturerQuestions);

module.exports = router;