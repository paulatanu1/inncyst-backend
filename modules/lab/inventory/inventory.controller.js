const Inventory = require("./inventory.model");

const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");

const getInventory = asyncHandler(async (req, res, next) => {
  let { id, page, size } = req.query;
  let data;

  if (id) {
    let dataById = await Inventory.findById(id);
    return res.json(dataById);
  }

  if (page && size) {
    data = await Inventory.find({})
      .limit(size)
      .skip((page - 1) * size);
  } else {
    data = await Inventory.find({});
  }

  return res.json(data);
});

const createInventory = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  let {
    item,
    category,
    quantity,
    description,
    modelNumber,
    make,
    yearOfManufacturing,
    isRentable,
  } = req.body;

  if (!userId) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  let inventory = await Inventory.create({
    item,
    category,
    quantity,
    description,
    modelNumber,
    make: Date.now(),
    yearOfManufacturing: Date.now(),
    isRentable,
    user: userId,
  });

  return res.status(201).send({
    status: true,
    data: inventory,
  });
});

const updateInventory = asyncHandler(async (req, res, next) => {
  let { id, newInventory } = req.body;
  await Inventory.findByIdAndUpdate(id, newInventory);

  return res.status(201).send({
    status: true,
    data: newInventory,
  });
});

const deleteInventory = asyncHandler(async (req, res, next) => {
  let { id } = req.query;

  if (!id) {
    return res.status(400).send({
      status: true,
      message: "id is required to delete inventory",
    });
  }
  await Inventory.findByIdAndDelete(id);

  return res.status(201).send({
    status: true,
    message: "Inventory deleted",
  });
});

module.exports = {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
