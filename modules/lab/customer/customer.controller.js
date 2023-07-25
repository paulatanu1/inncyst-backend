const Customers = require("./customer.model");

const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");

const getCustomer = asyncHandler(async (req, res, next) => {
  let { id, page, size } = req.query;
  let data = [];

  if (id) {
    let dataById = await Customers.findById(id);
    return res.json(dataById);
  }

  if (page && size) {
    data = await Customers.find({})
      .limit(size)
      .skip((page - 1) * size);
  } else {
    data = await Customers.find({});
  }

  return res.status(200).json({
    status: true,
    data: data,
  });
});

const createCustomer = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  if (!userId) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  let customers = await Customers.create(req.body);

  return res.status(201).send({
    status: true,
    data: customers,
  });
});

const updateCustomer = asyncHandler(async (req, res, next) => {
  let { id, updatedCustomerInfo } = req.body;
  let updatedCustomer = await Customers.findByIdAndUpdate(
    id,
    updatedCustomerInfo
  );

  return res.status(201).send({
    status: true,
    data: updatedCustomer,
  });
});

const deleteCustomer = asyncHandler(async (req, res, next) => {
  let { id } = req.query;

  if (!id) {
    return res.status(400).send({
      status: true,
      message: "id is required to delete Customers",
    });
  }
  await Customers.findByIdAndDelete(id);

  return res.status(201).send({
    status: true,
    message: "Customers deleted",
  });
});

module.exports = {
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
