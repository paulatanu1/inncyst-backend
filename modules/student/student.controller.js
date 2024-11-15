const student = require("../student/student.model");
const intranship = require("../intranship/intranship.model");
const industry = require("../industry/industryPost.model");
const fs = require("fs");
const { addAchivementBody } = require("../../middlewares/validator");
const path = require("path");
const { PDFDocument } = require('pdf-lib');
const portfolioModel = require('../auth/portfolio.model');
const { NodeMailer } = require("../../config/Mailer");
const uuid = require('uuid');
const moment = require('moment');
const userResume = require('./studentResume.model');
const achivement = require('./studentAchivement.model');

const studentController = {
  uploadResumeDemo: async (req, res) => {
    const { body, user } = req;
    const base64Data = body.resume;
    if (!base64Data) {
      return res.status(400).json({ error: "No base64 data provided" });
    }
    const savedData = await student.create({
      userId: user._id,
      resume: base64Data,
      jobId: body.jobId,
    });
    return res.status(200).json({
      success: true,
      data: savedData,
      message: "Successfully upload resume",
    });
  },

  uploadResume: async (req, res) => {
    const { user, body, files } = req;
    if (!body.jobId) {
      return res.status(400).json({
        success: false,
        message: "Job not found",
        data: {}
      })
    }
    if (files && files.resume) {
      if (files.resume.size > 5242880) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "File too Big, please select a file less than 5mb",
        });
      }
      if (
        files.resume.mimetype === "application/pdf" ||
        files.resume.mimetype === "application/PDF" ||
        files.resume.mimetype === "application/doc" ||
        files.resume.mimetype === "application/DOC" ||
        files.resume.mimetype === "application/docx" ||
        files.resume.mimetype === "application/DOCX"
      ) {
        const dir = __dirname + "/../../public/user-resume/";
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        const name = user._id + "." + files.resume.name;
        const path = dir + name;
        await files.resume.mv(path);
        const savedData = await student.create({
          userId: user._id,
          resume: `/user-resume/${name}`,
          jobId: body.jobId,
        });
        return res.status(200).json({
          success: true,
          data: savedData,
          message: "Successfully upload resume",
        });
      } else {
        return res.status(200).json({
          success: false,
          data: {},
          message: "Invalid file type",
        });
      }
    }
  },

  applyIntranship: async (req, res) => {
    const { user, body } = req;
    const check = await student.findOne({
      userId: user._id,
      jobId: body.jobId,
    });
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }
    if (check.status === true) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this job",
      });
    }
    const industryData = await industry.findById(body.jobId).populate('company');
    const countStudentData = await student.find();
    check.studentName = user.name;
    check.email = body.email;
    check.phone = body.phone;
    check.status = true;
    check.applicationId = generateCustomId(countStudentData.length + 1);
    check.availability = body.availability;
    if (body.availability === 1) {
      check.availability_message = body.availability_message;
    }
    const saveData = await check.save();
    sendapplicationmail(user, industryData, saveData)
    return res.status(200).json({
      success: true,
      data: saveData,
      message: "Application applied successfully",
    });
  },

  getAll: async (req, res) => {
    const { user } = req;
    let studentIntranshipData = await student
      .find({ status: true, userId: user._id })
      .lean();
    studentIntranshipData = studentIntranshipData.map(async (student) => {
      const intanshipDetails = await intranship.findOne({ _id: student.jobId });
      if (intanshipDetails) {
        return {
          ...student,
          jobDetails: intanshipDetails,
        };
      } else {
        const industryDetailsdata = await industry.findOne({
          _id: student.jobId,
        }).populate('company');
        if (industryDetailsdata) {
          return {
            ...student,
            jobDetails: industryDetailsdata,
          };
        }
      }
    });
    studentIntranshipData = await Promise.all(studentIntranshipData);
    return res.status(200).json({
      success: true,
      data: studentIntranshipData,
      message: "success",
    });
  },

  getById: async (req, res) => {
    const { user, params } = req;
    if (!params) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No data found",
      });
    }
    let studentIntranshipData = await student
      .findOne({
        _id: params.id,
        userId: user._id,
      })
      .lean();
    if (!studentIntranshipData) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "No data found",
      });
    }
    const intanshipDetails = await intranship.findOne({
      _id: studentIntranshipData.jobId,
    });
    if (intanshipDetails) {
      studentIntranshipData.intranshipDetails = intanshipDetails;
    } else {
      const industryDetailsdata = await industry.findOne({
        _id: studentIntranshipData.jobId,
      });
      if (industryDetailsdata) {
        studentIntranshipData.intranshipDetails = industryDetailsdata;
      }
    }
    const portfolioDataStudent = await portfolioModel.find({ user: user._id });
    if (portfolioDataStudent) {
      studentIntranshipData.portfolioData = portfolioDataStudent;
    } else {
      studentIntranshipData.portfolioData = null;
    }
    
    return res.status(200).json({
      success: true,
      data: studentIntranshipData,
      message: "success",
    });
  },

  // student resume data
  addUserResume: async (req, res) => {
    try {
      const { user, body } = req;
      if (!body.resume) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "Please enter a resume"
        });
      }
      const filter = { user: user._id, deletedAt: null, status: true };
      const foundData = await userResume.findOne(filter);
      if (foundData) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "Resume already exists"
        });
      }
      const saveData = await userResume.create({
        user: user._id,
        resume: body.resume
      });
      if (saveData) {
        return res.status(200).json({
          success: true,
          data: saveData,
          message: "Resume upload successfully"
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Server error"
      });
    }
  },

  updateUserResume: async (req, res) => {
    try {
      const { user, body, params } = req;
      const foundData = await userResume.findOne({ _id: params.id, user: user._id });
      if (!foundData) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "Resume not found"
        });
      }
      const updateResume = await userResume.findOneAndUpdate({
        _id: params.id
      }, { resume: body.resume }, { new: true });
      return res.status(200).json({
        success: true,
        data: updateResume,
        message: "Resume update successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Server error"
      });
    }
  },
  getUserResume: async (req, res) => {
    try {
      const { user } = req;
      const filter = { deletedAt: null, status: true, user: user._id };
      const data = await userResume.find(filter);
      return res.status(200).json({
        success: true,
        data,
        message: "Resume"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Server error"
      });
    }
  },
  deleteUserResume: async (req, res) => {
    try {
      const { user, params } = req;
      const responseData = await userResume.findOne({ _id: params.id });
      if (responseData) {
        responseData.status = false;
        responseData.deletedAt = new Date();
        await responseData.save();
      }
      return res.status(200).json({
        success: true,
        data,
        message: "Resume deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Server error"
      });
    }
  },

  // Student Achivement
  addAchivement: async (req, res) => {
    const { body, user } = req;
    try {
      const achivementData = await achivement.find().countDocuments();
      const rendomId = `ACH-${achivementData+1}`;
      const { error } = addAchivementBody(body);
      if (error) {
        return res.status(400).json({
          success: false,
          data: {},
          message: error.message
        });
      }
      const savedAchivementData = new achivement();
      savedAchivementData.id = rendomId;
      savedAchivementData.user = user._id;
      savedAchivementData.title = body.title;
      savedAchivementData.description = body.description;
      savedAchivementData.date = body.date;
      savedAchivementData.held = body.held;
      const savedData = await savedAchivementData.save();
      if (savedData) {
        return res.status(200).json({
          success: true,
          data: savedData,
          message: "Data saved successfully"
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Server error"
      });
    } 
  },
  achivementlist: async (req, res) => {
    const { body, user } = req;
    try {
      const filter = { user: user._id, deletedAt: null };
      const listData = await achivement.find(filter);
      return res.status(200).json({
        success: true,
        data: listData,
        message: ""
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Server error"
      });
    } 
  },
  achivementById: async (req, res) => {
    try {
      const { params, user } = req;
      const filter = {
        id: params.id,
        user: user._id
      }
      const getById = await achivement.findOne(filter);
      if (!getById) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "No data found"
        });
      }
      return res.status(200).json({
        success: true,
        data: getById,
        message: ""
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Server error"
      });
    }
  },
  achivementEdit: async (req, res) => {
    try {
      const { params, user, body } = req;
      const filter = {
        id: params.id,
        user: user._id
      };
      const editData = await achivement.findOneAndUpdate(
        filter,
        body,
        { new: true },
      );
      return res.status(200).json({
        success: true,
        data: editData,
        message: "Edit succesfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Server error"
      });
    }
  },
  achivementDelete: async (req, res) => {
    try {
      const { params, user } = req;
      const filter = {
        id: params.id,
        user: user._id
      }
      const getById = await achivement.findOne(filter);
      if (!getById) {
        return res.status(400).json({
          success: false,
          data: {},
          message: "No data found"
        });
      }
      getById.deletedAt = new Date();
      getById.status = false;
      await getById.save();
      return res.status(200).json({
        success: true,
        data: getById,
        message: "Deleted succesfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Server error"
      });
    }
  }
};

const sendapplicationmail = async (user, industryData, saveData) => {
  try {
    const mailOptions = {
      subject: `Application Successful - ${industryData.company.companyName}`,
      email: user.email,
      data: {
        user: user,
        industryData: industryData,
        student: saveData
      },
      template: "templates/applicationSubmit.ejs",
    };
    const nodeMailer = new NodeMailer(mailOptions);
    await nodeMailer.sentMail();
  } catch (error) {
    console.log(error);
    return error;
  }
}

// student application id
function generateCustomId(counter) {
    const currentDate = moment().format('YYYYMMDD');
    const customId = `${currentDate}-${counter}`;
    return customId;
}

module.exports = studentController;
