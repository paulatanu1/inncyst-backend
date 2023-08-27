const industryModel = require("./industry.model");
const authModel = require("../auth/auth.model");
const { industryQuestions } = require("../../middlewares/validator");
const postModel = require("./industryPost.model");
const studentModel = require('../student/student.model');

const companyQuestions = async (req, res) => {
  const { user, body } = req;
  const { error } = industryQuestions(body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  const questions = new industryModel({
    industryId: body.industryId,
    companyName: body.companyName,
    companyEstdYear: body.companyEstdYear,
    aboutCompany: body.aboutCompany,
    empCount: body.empCount,
    workPlace: body.workPlace,
    salaryPackege: body.salaryPackege,
  });
  const saveQuestions = await questions.save();
  if (saveQuestions) {
    // user.question_step = true;
    // await user.save();
    await authModel.findOneAndUpdate(
      { _id: user._id },
      { question_step: true },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: saveQuestions,
      message: "Questions saved.",
    });
  }
  return res.status(400).json({
    success: false,
    data: {},
    message: "Something Wrong",
  });
};

const getAll = async (req, res) => {
    const { user } = req;
  const posts = await postModel.find({ industryId: user._id });
  return res.status(200).json({
    success: true,
    data: posts,
    message: "",
  });
};

const addPost = async (req, res) => {
  const { body, user } = req;
  const savedPost = new postModel({
    industryId: user._id,
    type: body.type,
    details: body.details,
    skills: body.skills,
    intranshipType: body.intranshipType,
    startDate: body.startDate,
    duration: body.duration,
    jobOpening: body.jobOpening,
    responsibilities: body.responsibilities,
    stipend: body.stipend,
    salary: body.salary,
    salaryType: body.salaryType,
    perks: body.perks,
  });
  const result = await savedPost.save();
  if (result) {
    return res.status(200).json({
      success: true,
      data: result,
      message: "Post saved successfully",
    });
  } else {
    return res.status(400).json({
      success: false,
      data: {},
      message: "Unable to saved post",
    });
  }
};

const editPost = async (req, res) => {
  const { params, body } = req;
  const filter = { _id: params.id };
  const data = await postModel.findOneAndUpdate(filter, body, { new: true });

  if (data) {
    return res.status(200).json({
      status: true,
      data: data,
      message: "Updated successfully",
    });
  }
  return res.status(400).json({
    success: false,
    message: "Something wrong",
  });
};

const updateStatus = (req, res) => {
  const { params, body } = req;
  const filter = { _id: params.id };
  const data = postModel.findOneAndUpdate(
    filter,
    { status: body.status },
    { new: true }
  );
  return res.status(200).json({
    status: true,
    data: data,
    message: "Status Updated successfully",
  })
};

const postDelete = async (req, res) => {
  const { params } = req;
  const filter = { _id: params.id };
  const deleteData = await postModel.findOne(filter);
  if (!deleteData) {
    return res.status(400).json({
      status: false,
      data: {},
      message: "Unable to delete post",
    });
  }
  await postModel.deleteOne(filter);
  return res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
};

const updateStatusOfStudent = async (req, res) => {
  const { params, body } = req;
  const filter = { _id: params.id };
  const data = await studentModel.findOneAndUpdate(
    filter,
    { applicationStatus: body.applicationStatus },
    { new: true }
  );
  return res.status(200).json({
    status: true,
    data: data,
    message: "Application Status Updated successfully",
  })
};

module.exports = { companyQuestions, getAll, addPost, editPost, updateStatus, postDelete, updateStatusOfStudent };
