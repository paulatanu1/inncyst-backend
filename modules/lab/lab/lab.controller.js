const Lab = require("./lab.model");
const RequestLabpool = require("../../organization/request/request.model");

const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");
const bcrypt = require("bcryptjs");
const { NodeMailer } = require("../../../config/Mailer");
const { getImageExtension } = require("../../../utils/fileExtentionFromBase64");
const fs = require("fs");
const path = require("path");
const { ROOT_PATH } = require("../../../config");
const jwt = require("jsonwebtoken");

const onBoardAlab = asyncHandler(async (req, res, next) => {});

const labRegister = async (req, res) => {
  try {
    const { body, files } = req;
    const existLab = await Lab.findOne({ email: body.email });
    if (existLab) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "This lab is already exixts!",
      });
    }

    const password = Math.random().toString(36).substring(2, 10);
    const labInstance = await Lab.create({
      labName: body.labName,
      email: body.email,
      contactPerson: body.contactPerson,
      phoneNumbers: body.phoneNumbers,
      address: body.address,
      isAccredited: body.isAccredited === "yes" ? true : false,
      accreditionValidUpto: body.accreditionValidUpto,
      category: body.category,
      affiliation: body.affiliation,
      labDescription: body.labDescription,
      labWebsite: body.labWebsite,
      password: bcrypt.hashSync(password, 10),
      token: body.token,
    });

    if (files && files.certificate) {
      const dir = ROOT_PATH + "/public/lab-certificate/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const name =
        Math.random().toString(36).substring(2, 50) +
        "." +
        files.certificate.name.split(".").pop();
      const path = dir + name;
      const err = await files.certificate.mv(path);
      if (err) {
        console.log(err);
        this.message = err;
        return this.response(user, true, 400);
      }
      labInstance.accreditionCertificate = "/lab-certificate/" + name;
    }

    if (body && body.logo) {
      const extention = getImageExtension(body.logo);
      const dir = ROOT_PATH + "/public/lab-logo/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const name = `${labInstance.labName}${extention}`;
      const imageBuffer = Buffer.from(body.logo.split(",")[1], "base64");
      fs.writeFileSync(path.join(dir, name), imageBuffer);
      labInstance.logo = "/lab-logo/" + name;
    }

    await labInstance.save();

    const mailOptions = {
      subject: "Lab Register",
      email: body.email,
      data: {
        email: body.email,
        password,
      },
      template: "templates/lab-welcome.ejs",
    };
    const nodeMailer = new NodeMailer(mailOptions);
    await nodeMailer.sentMail();
    if (labInstance) {
      return res.status(201).json({
        success: true,
        data: labInstance,
        message: "Lab registered successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      message: error.message || "Server error",
    });
  }
};

const labLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lab = await Lab.findOne({ email });
    if (!lab) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Lab not found",
      });
    }
    if (!lab.status) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Lab is not active",
      });
    }
    const isMatch = await bcrypt.compare(password, lab.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid password",
      });
    }
    const token_jwt = jwt.sign({ _id: lab._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    return res.status(200).json({
      success: true,
      messege: "Logged in successfully",
      LOGIN_TYPE: lab.role,
      data: lab,
      token: token_jwt,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const createLab = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  if (!userId) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  return res.status(201).send({
    status: true,
    data: [],
  });
});

const addTechnician = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { labId, technician } = req.body;
  if (!userId || !labId) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  return res.status(201).send({
    status: true,
    data: lab,
  });
});

const getLabs = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { profileId } = req.params;
  if (!userId || !profileId) {
    return next(new ErrorResponse("Missing fields", 400));
  }
  const lab = await Lab.findOne({ profileId, user: userId });
  return res.status(201).send({
    status: true,
    data: lab,
  });
});

const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const current_user = req.user;
    if (old_password === new_password) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "New password not same as old password",
      });
    }
    const labUser = await Lab.findOne({
      _id: current_user._id,
    });
    const matchPassword = bcrypt.compareSync(old_password, labUser.password);
    if (!matchPassword) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Old Password mismatch",
      });
    }
    const hashPassword = bcrypt.hashSync(new_password, 10);
    labUser.password = hashPassword;
    await labUser.save();
    return res.status(200).json({
      status: true,
      data: labUser,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

module.exports = {
  labRegister,
  labLogin,
  createLab,
  getLabs,
  addTechnician,
  onBoardAlab,
  changePassword,
};
