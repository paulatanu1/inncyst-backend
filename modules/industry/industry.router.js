const router = require("express").Router();
const {companyQuestions, getAll, addPost, editPost, postDelete} = require('./industry.controller');
const Authenticate = require('../../middlewares/isLoggedIn.middleware');

router.post('/industry-question', Authenticate, companyQuestions);
router.get('/industry-posts', Authenticate, getAll);
router.post('/add-post', Authenticate, addPost);
router.put('/post-edit/:id', editPost);
router.delete('/delete-post/:id', postDelete);


module.exports = router;