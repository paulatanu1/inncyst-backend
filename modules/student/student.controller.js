const student = require("../student/student.model");
const fs = require("fs");
const { applyForIntranship } = require('../../middlewares/validator');

const studentController = {
  applyIntranship: async (req, res) => {
    const { user, body, files } = req;
    const { error } = applyForIntranship(body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
    const check = await student.findOne({
      userId: user._id,
      intranshipId: body.intranshipId,
    });
    if (check) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "You have already applied for this programme.",
      });
    }
    const studentModel = new student();
    studentModel.intranshipId = body.intranshipId;
    studentModel.userId = user._id;
    studentModel.studentName = user.name;
    studentModel.email = body.email;
    studentModel.phone = body.phone;
    studentModel.availability = body.availability;
    if (body.availability === 1) {
      studentModel.availability_message = body.availability_message;
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
        studentModel.resume = "/user-resume/" + name;
      } else {
        return res.status(200).json({
          success: false,
          data: {},
          message: "Invalid file type",
        });
      }
    }
    const saveData = await studentModel.save();
    return res.status(200).json({
      success: true,
      data: saveData,
      message: "success",
    });
  },
};

module.exports = studentController;
