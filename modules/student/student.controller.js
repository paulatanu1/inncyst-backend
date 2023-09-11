const student = require("../student/student.model");
const intranship = require("../intranship/intranship.model");
const industry = require("../industry/industryPost.model");
const fs = require("fs");
const { applyForIntranship } = require("../../middlewares/validator");
const path = require("path");

const studentController = {
  uploadResume: async (req, res) => {
    const { user, body } = req;
    const resumeData = body.resume;
    if (!resumeData) {
      return res.status(400).json({ message: "Base64 string is required." });
    }
    const mimeMatch = resumeData.match(
      /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/
    );
    const mimeType = mimeMatch[1];
    if (mimeType !== "application/pdf")
      return res
        .status(400)
        .json({ success: false, message: "Invalid file format" });
    const fileName = `${user._id}.pdf`;
    const filepath = __dirname + "/../../public/user-resume/";
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
    }
    const resultPdf = filepath + fileName;
    const pdfBuffer = Buffer.from(resumeData.split(",")[1], "base64");
    fs.writeFileSync(path.join(resultPdf), pdfBuffer);
    const savedData = await student.create({
      userId: user._id,
      resume: `/user-resume/${fileName}`,
      jobId: body.jobId,
    });
    return res.status(200).json({
      success: true,
      data: savedData,
      message: "Successfully upload resume",
    });
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
    check.studentName = user.name;
    check.email = body.email;
    check.phone = body.phone;
    check.status = true;
    check.availability = body.availability;
    if (body.availability === 1) {
      check.availability_message = body.availability_message;
    }
    const saveData = await check.save();
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
          intranshipDetails: intanshipDetails,
        };
      } else {
        const industryDetailsdata = await industry.findOne({
          _id: student.intranshipId,
        });
        if (industryDetailsdata) {
          return {
            ...student,
            intranshipDetails: industryDetailsdata,
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
    return res.status(200).json({
      success: true,
      data: studentIntranshipData,
      message: "success",
    });
  },
};

module.exports = studentController;
