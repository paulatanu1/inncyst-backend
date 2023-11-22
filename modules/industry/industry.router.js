const router = require("express").Router();
const {
  companyQuestions,
  myProfile,
  getAll,
  getById,
  addPost,
  submitPost,
  editPost,
  updateStatus,
  postDelete,
  updateStatusOfStudent,
  appliedStudentList,
} = require("./industry.controller");
const Authenticate = require("../../middlewares/isLoggedIn.middleware");

// Industry Profile
router.get("/industry/profile", Authenticate, myProfile);


// Job Management
router.post("/industry-question", Authenticate, companyQuestions);
router.get("/industry-posts", getAll);
router.get("/industry-posts/:id", getById);
router.post("/add-post", Authenticate, addPost);
router.put("/add-post", Authenticate, submitPost);
router.put("/post-edit/:id", editPost);
router.put("/post-status/:id", updateStatus);
router.put("/student-application-status/:id", updateStatusOfStudent);
router.delete("/delete-post/:id", postDelete);
router.get("/applied-student/:id", Authenticate, appliedStudentList);

module.exports = router;
