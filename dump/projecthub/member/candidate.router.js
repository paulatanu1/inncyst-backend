const router = require("express").Router();

const {
  createAuthor,
  deleteAuthor,
  searchAuthor,
} = require("./candidate.controller");

router.post("/", createAuthor);
router.get("/search", searchAuthor);
router.delete("/:id", deleteAuthor);

module.exports = router;
