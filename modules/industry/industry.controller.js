const industryModel = require("./industry.model");
const authModel = require("../auth/auth.model");
const {
  industryQuestions,
  industryPostIntranship,
  industryPostJob
} = require("../../middlewares/validator");
const postModel = require("./industryPost.model");
const studentModel = require("../student/student.model");
const USERTYPES = require('../common/userType');
const jwt = require('jsonwebtoken');
const portfolioModel = require('../auth/portfolio.model');

const companyQuestions = async (req, res) => {
  const { user, body, params } = req;
  if (params.id) {
    const savedData = await industryModel.findOneAndUpdate(
      { _id: params.id },
      body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: savedData,
      message: "Profile updated.",
    });
  }
  const check = await industryModel.findOne({ industryId: user._id });
  if (check) {
    return res.status(400).json({
      success: false,
      data: {},
      message: "Profile already updated.",
    });
  }
  const { error } = industryQuestions(body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  const questions = new industryModel({
    industryId: user._id,
    companyName: body.companyName,
    image: body.image,
    companyEstdYear: body.companyEstdYear,
    aboutCompany: body.aboutCompany,
    empCount: body.empCount,
    workPlace: body.workPlace,
    status: true
  });
  const saveQuestions = await questions.save();
  if (saveQuestions) {
    await authModel.findOneAndUpdate(
      { _id: user._id },
      { question_step: true },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: {saveQuestions, user},
      message: "Profile updated.",
    });
  }
  return res.status(400).json({
    success: false,
    data: {},
    message: "Something Wrong",
  });
};

const myProfile = async (req, res) => {
  const { user } = req;
  try {
    if (user.role !== 'industry') {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
        data: {}
      });
    }
    const profile = await industryModel.findOne({ industryId: user._id }).populate('industryId');
    return res.status(200).json({
      success: true,
      message: "",
      data: profile
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error"
    })
  }
}

const getAll = async (req, res) => {
  const { query } = req;
  const filter = {};
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
  try {
    if (token) {
      const auth = jwt.verify(token, process.env.JWT_SECRET);
      const user = await authModel.findById(auth._id);
      if (user && user.role === 'industry') {
        filter.industryId = user._id
      } else {
        filter.status = true
      }
    } else {
      filter.status = true
    }
    
    if (query) {
      if (query.status) {
        filter.status = query.status;
      }
      if (query.jobOpening) {
        filter.jobOpening = { $lte: query.jobOpening };
      }
      if (query.stipend) {
        filter.stipend = { $lte: query.stipend };
      }
      if (query.type) {
        filter.type = query.type;
      }
      if (query.jobType) {
        filter.intranshipType = query.jobType;
      }
      if (query.skills) {
        filter.skills = { $in: query.skills };
      }
      if (query.location) {
        filter.location = query.location.toUpperCase();
      }
      if (query.salaryFrom && query.salaryTo) {
        filter.salary = { $lte: query.salaryTo, $gte: query.salaryFrom };
      }
      if (query.sort && query.sort === "asc") {
        query.sort = { createdAt: 1 };
      }
      if (query.sort && query.sort === "dsc") {
        query.sort = { createdAt: -1 };
      }
    }
    const posts = await postModel
      .find(filter).populate('company')
      .sort(query.sort)
      .limit(query.limit)
      .skip(query.page * query.limit);
      const postsWithAppliedKey = await Promise.all(posts.map(async (post) => {
        if (token) {
          const auth = jwt.verify(token, process.env.JWT_SECRET);
          const user = await authModel.findById(auth._id);
          const check = await studentModel.findOne({
            userId: user ? user._id : null,
            jobId: post._id,
          });
          return {
            ...post.toObject(),
            applied: check && check.status ? true : false,
          };
        } else {
          return {
            ...post.toObject(),
            applied: false,
          };
        }
      }));
    const total = await postModel.find(filter).countDocuments();
    return res.status(200).json({
      success: true,
      data: {
        total: total,
        items: postsWithAppliedKey,
      },
      message: "Successfully get list of jobs",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
  
};

const getById = async (req, res) => {
  const { params } = req;
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
  try {
    const result = await postModel.findOne({
      _id: params.id,
    }).populate('company').lean();
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "no such job found",
        data: null,
      });
    }
    if (token) {
      const auth = jwt.verify(token, process.env.JWT_SECRET);
      const user = await authModel.findById(auth._id);
      const check = await studentModel.findOne({
        userId: user ? user._id : null,
        jobId: result._id,
      });
      result.applied = check && check.status ? true : false;
    } else {
      result.applied = false;
    }
    return res.status(200).json({
      success: true,
      data: result,
      message: "success",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: {},
      message: error.message,
    });
  }
};

const addPost = async (req, res) => {
  const { body, user } = req;
  try {
    if (user.role !== 'industry') {
      return res.status(400).json({
        success: false,
        message: "not allow"
      });
    }
    if (user.question_step === false) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile for post a job',
        data: {}
      });
    }

    const comapanyDetails = await industryModel.findOne({ industryId: user._id });
    body.industryId = user._id;
    body.status = false;
    body.company = comapanyDetails._id;
    body.coverLetter = {
      letter: body.letter,
      availability: body.availability,
      moreQuestions: body.moreQuestions
    }
  
    if (body.id) {   // save druft after submit
      const findresult = await postModel.findOneAndUpdate(
        { _id: body.id },
        body,
        { new: true }
      );
      return res.status(200).json({
        success: true,
        data: findresult,
        message: "Post saved to draft successfully",
      });
    }

    // body.coverLetter = {
    //   letter: body.letter,
    //   availability: body.availability,
    //   moreQuestions: body.moreQuestions
    // }

    const savedPost = new postModel(body);
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
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: {},
      message: error.message,
    });
  }
};

const submitPost = async (req, res) => {
  const { user, body } = req;
  try {
    body.status = true;
    if (body.type === 'job') {
      const { error } = industryPostJob(body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      // const checkResult = await postModel.findOne({ _id: body.id });
      // if (checkResult && checkResult.status) {
      //   return res.status(200).json({
      //     success: true,
      //     message: "Already submitted",
      //   });
      // }
      body.location = body.location.toUpperCase();

      body.coverLetter = {
        letter: body.letter,
        availability: body.availability,
        moreQuestions: body.moreQuestions
      }

      const savedPost = await postModel.findOneAndUpdate({ _id: body.id }, body, {
        new: true,
      });
      if (savedPost) {
        return res.status(200).json({
          success: true,
          data: savedPost,
          message: "Job Post updated successfully",
        });
      }
    }
    if (body.type === 'intranship') {
      const { error } = industryPostIntranship(body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      // const checkResult = await postModel.findOne({ _id: body.id });
      // if (checkResult && checkResult.status) {
      //   return res.status(200).json({
      //     success: true,
      //     message: "Already submitted",
      //   });
      // }
      body.location = body.location.toUpperCase();

      body.coverLetter = {
        letter: body.letter,
        availability: body.availability,
        moreQuestions: body.moreQuestions
      }
      
      const savedPost = await postModel.findOneAndUpdate({ _id: body.id }, body, {
        new: true,
      });
      if (savedPost) {
        return res.status(200).json({
          success: true,
          data: savedPost,
          message: "Internship Post updated successfully",
        });
      }
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      data: {},
      message: "Unable to submit post",
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

const updateStatus = async (req, res) => {
  const { params, body } = req;
  const filter = { _id: params.id };
  const checkActiveStatus = await postModel.findOne(filter);
  if (checkActiveStatus.status === body.status) {
    const message = body.status
      ? "Post Already Published"
      : "Post Unpublished";

    return res.status(200).json({
      status: true,
      data: {},
      message,
    });
  }
  // if (checkActiveStatus.status === true && body.status === true) {
  //   return res.status(200).json({
  //     status: true,
  //     data: {},
  //     message: "Post Already Published",
  //   });
  // }
  // if (checkActiveStatus.status === false && body.status === false) {
  //   return res.status(200).json({
  //     status: true,
  //     data: {},
  //     message: "Post Unpublished",
  //   });
  // }
  const data = await postModel.findOneAndUpdate(
    filter,
    { status: body.status },
    { new: true }
  );
  return res.status(200).json({
    status: true,
    data: data,
    message: "Status Updated successfully",
  });
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
  });
};

const appliedStudentList = async (req, res) => {
  const { user, params } = req;
  try {
    if (user.role !== USERTYPES.INDUSTRY) {
      return res.status(400).json({
        status: false,
        data: {},
        message: 'Unreachable for the role ' + user.role,
      });
    }
    const applicationsOfStudent = await studentModel.find({ jobId: params.id }).populate("userId");

  const promises = applicationsOfStudent.map(async (item) => {
    const portfolioData = await portfolioModel.find({ user: item.userId._id });
    if (portfolioData.length) {
      return { ...item.toObject(), portfolioData };
    } else {
      return { ...item.toObject(), portfolioData: [] };
    }
  });

  const applicationsWithPortfolio = await Promise.all(promises);

  return res.status(200).json({
    success: true,
    data: applicationsWithPortfolio,
    message: "Successfully retrieved applications of students with portfolio data",
  });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: {},
      message: error.message,
    });
  }
};

const appliedStudentDetails = async (req, res) => {
  const { params, user } = req;
  try {
    if (user.role !== USERTYPES.INDUSTRY) {
      return res.status(400).json({
        status: false,
        data: {},
        message: 'Unreachable for the role ' + user.role,
      });
    }
    const applicationsOfStudent = await studentModel.findOne({ jobId: params.id, _id: params.student }).populate("userId").lean();
    applicationsOfStudent.jobDetails = await postModel.findOne({ _id: params.id})
    const portfolioData = await portfolioModel.find({ user: applicationsOfStudent.userId });
    if (portfolioData.length) {
      applicationsOfStudent.portfolioData = portfolioData;
    } else {
      applicationsOfStudent.portfolioData = [];
    }

  return res.status(200).json({
    success: true,
    data: applicationsOfStudent,
    message: "Successfully retrieved application of student with portfolio data",
  });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: {},
      message: error.message,
    });
  }
}

module.exports = {
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
  appliedStudentDetails
};
