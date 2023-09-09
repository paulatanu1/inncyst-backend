const router = require("express").Router();
const {companyQuestions, getAll, addPost, submitPost, editPost, updateStatus, postDelete, updateStatusOfStudent} = require('./industry.controller');
const Authenticate = require('../../middlewares/isLoggedIn.middleware');

router.post('/industry-question', Authenticate, companyQuestions);
router.get('/industry-posts', Authenticate, getAll);
router.post('/add-post', Authenticate, addPost);
router.put('/add-post', Authenticate, submitPost);
router.put('/post-edit/:id', editPost);
router.put('/post-status/:id', updateStatus);
router.put('/student-application-status/:id', updateStatusOfStudent)
router.delete('/delete-post/:id', postDelete);


module.exports = router;