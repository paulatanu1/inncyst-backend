const student = require("../student/student.model");
const intranship = require("../intranship/intranship.model");
const industry = require("../industry/industryPost.model");
const fs = require("fs");
const { applyForIntranship } = require("../../middlewares/validator");
const path = require("path");
const { PDFDocument } = require('pdf-lib');
const portfolioModel = require('../auth/portfolio.model');

const studentController = {
  uploadResumeDemo: async (req, res) => {
    const { body, user } = req;
    const base64Data = body.resume;
    if (!base64Data) {
      return res.status(400).json({ error: "No base64 data provided" });
    }
    // const filepath = __dirname + "/../../public/user-resume/";
    // if (!fs.existsSync(filepath)) {
    //   fs.mkdirSync(filepath);
    // }
    // const fileName = `PDF_${user._id}.pdf`;
    // const resultfile = filepath + fileName;
    // const fileBuffer = Buffer.from(base64Data.split(',')[1], 'base64');
    // const fileBuffer = Buffer.from(base64Data, 'base64');
    // fs.writeFileSync(path.join(resultfile), fileBuffer);
    const savedData = await student.create({
      userId: user._id,
      // resume: `/user-resume/${fileName}`,
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
    check.studentName = user.name;
    check.email = body.email;
    check.phone = body.phone;
    check.status = true;
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

module.exports = studentController;
