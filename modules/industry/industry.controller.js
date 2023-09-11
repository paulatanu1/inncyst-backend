const industryModel = require("./industry.model");
const authModel = require("../auth/auth.model");
const { industryQuestions, industryPost } = require("../../middlewares/validator");
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
  const { user, query } = req;
  const filter = {
    industryId: user._id,
  };
  if (query) {
    if (query.status) {
      filter.status = query.status;
    }
    if (query.jobOpening) {
      filter.jobOpening = {$lte: query.jobOpening};
    }
    if (query.stipend) {
      filter.stipend = { $lte: query.stipend };
    }
    if (query.intranshipType) {
      filter.intranshipType = query.intranshipType;
    }
    if (query.skills) {
      filter.skills = { $in: query.skills };
    }
  }
  const posts = await postModel.find(filter)
  .limit(query.limit)
  .skip(query.page * query.limit);
  const total = await postModel.find(filter).countDocuments();
  return res.status(200).json({
    success: true,
    data: {
      total: total,
      items: posts
    },
    message: "Successfully get list of jobs",
  });
};

const getById = async (req, res) => {
  const { params } = req;
  const result = await postModel.findOne({
    _id: params.id
  });
  if (!result) {
    return res.status(400).json({
      success: false,
      message: "no such job found",
      data: null
    })
  }
  return res.status(200).json({
    success: true,
    data: result,
    message: "success",
  });
}

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

const submitPost = async (req, res) => {
  const { body } = req;
  const { error } = industryPost(body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  const savedPost = await postModel.findOneAndUpdate(
    { _id: body.id },
    body,
    { new: true }
  );
  if (savedPost) {
    return res.status(200).json({
      success: true,
      data: savedPost,
      message: "Post updated successfully",
    });
  }
  return res.status(400).json({
    success: false,
    data: {},
    message: "Unable to submit post",
  });
}

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

module.exports = { companyQuestions, getAll, getById, addPost, submitPost, editPost, updateStatus, postDelete, updateStatusOfStudent };
