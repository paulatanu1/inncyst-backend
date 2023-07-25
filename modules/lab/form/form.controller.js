const Form = require("./form.model");

const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");

const createForm = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { formName, formType } = req.body;
  const form = await Form.create({ formName, formType, user: userId });

  return res.status(201).send({
    status: true,
    data: form,
  });
});

const updateForm = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  console.log(req.body);

  const { formName, fields, id } = req.body;
  const form = await Form.findByIdAndUpdate(
    { _id: id },
    { $push: { fields } },
    { new: true, upsert: true }
  );

  return res.status(201).send({
    status: true,
    data: form,
  });
});

const getForm = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: formId } = req.query;
  console.log("Reached Here");
  const payload = { user: userId };

  let form;
  if (formId) {
    payload._id = formId;
    form = await Form.find(payload);
  } else {
    form = await Form.find({ user: userId });
  }
  return res.status(201).send({
    status: true,
    data: form,
  });
});

module.exports = {
  getForm,
  createForm,
  updateForm,
};
