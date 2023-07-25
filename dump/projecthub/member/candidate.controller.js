const Author = require("./candidate.model");

const createAuthor = async (req, res, next) => {
  const { email } = req.body;

  const authorAlreadyPresent = await Author.findOne({ email });
  if (!authorAlreadyPresent) {
    try {
      const author = await Author.create(req.body);
      return res.status(201).send({
        message: "Success!!! Author added",
        status: "success",
        data: author,
      });
    } catch (error) {
      return res.status(400).send({
        message: `Error ocurred while creating author with email ${email}`,
        error,
      });
    }
  }

  return res.status(400).send({
    message: `Author already available`,
    status: "failure",
    data: authorAlreadyPresent,
  });
};

const updateAuthor = (req, res, next) => {};

const deleteAuthor = async (req, res, next) => {
  const { id } = req.params;

  try {
    const authorDeleted = await Author.findOneAndDelete({ _id: id });
    return res.status(200).send({
      message: `Author has been deleted`,
      data: authorDeleted,
    });
  } catch (error) {
    return res.status(400).send({
      message: `Error ocurred while deleting author`,
      error,
    });
  }
};

const searchAuthor = async (req, res, next) => {
  const { q } = req.query;
  try {
    const authors = await Author.find({
      firstName: {
        $regex: q,
        $options: "i",
      },
    });
    if (authors.length <= 0) {
      return res.status(400).send({
        message: `No results found`,
        data: [],
      });
    }
    return res.status(200).send({
      message: `success`,
      data: authors,
    });
  } catch (error) {
    return res.status(400).send({
      message: `Error ocurred while searching author`,
      error,
    });
  }
};

module.exports = { createAuthor, updateAuthor, deleteAuthor, searchAuthor };
