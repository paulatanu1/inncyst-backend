const Expenses = require("./expenses.model");

const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");

const getExpenses = asyncHandler(async (req, res, next) => {
  let { id, page, size } = req.query;
  let data;

  if (id) {
    let dataById = await Expenses.findById(id);
    return res.json(dataById);
  }

  if (page && size) {
    data = await Expenses.find({})
      .limit(size)
      .skip((page - 1) * size);
  } else {
    data = await Expenses.find({});
  }

  return res.json(data);
});

const createExpenses = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  if (!userId) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  let Expenses = await Expenses.create(req.body);

  return res.status(201).send({
    status: true,
    data: Expenses,
  });
});

const updateExpenses = asyncHandler(async (req, res, next) => {
  let { id, newExpenses } = req.body;
  await Expenses.findByIdAndUpdate(id, newExpenses);

  return res.status(201).send({
    status: true,
    data: newExpenses,
  });
});

const deleteExpenses = asyncHandler(async (req, res, next) => {
  let { id } = req.query;

  if (!id) {
    return res.status(400).send({
      status: true,
      message: "id is required to delete Expenses",
    });
  }
  await Expenses.findByIdAndDelete(id);

  return res.status(201).send({
    status: true,
    message: "Expenses deleted",
  });
});

module.exports = {
  getExpenses,
  createExpenses,
  updateExpenses,
  deleteExpenses,
};
