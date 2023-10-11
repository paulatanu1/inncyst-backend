const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("./auth.model");
const otpModel = require("./otp.model");
const { transporter } = require("../../config/email");
const { generateOtp } = require("../../config/otp");
const { sendSMS } = require("../../config/fast2sms");
const { NodeMailer } = require("../../config/Mailer");
const fs = require("fs");
const path = require("path");
const { response } = require("express");
const {
  registratonRequest,
  loginRequests,
} = require("../../middlewares/validator");

const register = async (req, res) => {
  const { role, name, email, phone, password } = req.body;
  const { error } = registratonRequest(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
  const userData = await authModel.findOne({ email, role });
  if (userData) {
    return res.status(400).json({
      success: false,
      message: "User Already exist",
    });
  }
  const saveAuthData = new authModel({
    name: name,
    email: email,
    phone: phone,
    password: password,
    role: role,
  });
  const savedUser = await saveAuthData.save();
  sendOtp(savedUser);
  const verify_token = jwt.sign(
    { _id: savedUser._id, email: savedUser.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
  setTimeout(() => {
    otpModel
      .findOneAndUpdate(
        { userId: savedUser._id },
        { emailOtp: null, phoneOtp: null },
        { new: true }
      )
      .then((val) => console.log(val));
  }, 60000 * 5);
  return res.status(200).json({
    success: true,
    data: savedUser,
    token: verify_token,
    message: "Successfully registered.",
  });
};

const profile = async (req, res) => {
  const { params } = req;
  const userprofile = await authModel.findOne({ _id: params.id });
  if (!userprofile) {
    return res.status(400).json({
      success: false,
      message: "User does not exist",
      data: null,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Successfully get user profile",
    data: userprofile,
  });
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  const { error } = loginRequests(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
  const user = await authModel.findOne({ email, role }).select("+password");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  if (user.verified === false) {
    return res.status(400).json({
      success: false,
      message: "please varify your email and phone",
    });
  }
  const compPassword = await bcrypt.compare(password, user.password);
  if (compPassword) {
    const token_jwt = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    return res.status(200).json({
      success: true,
      messege: "Logged in successfully",
      LOGIN_TYPE: role,
      data: user,
      token: token_jwt,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "invalid password",
    });
  }
};

const getMe = async (req, res) => {
  const { user } = req;
  const userData = await authModel.findById(user._id);
  return res.status(200).json({
    success: true,
    data: userData,
    message: "",
  });
};

const editProfile = async (req, res) => {
  const { user, body } = req;
  const userData = await authModel.findOneAndUpdate({ _id: user._id }, body, {
    new: true,
  });
  if (userData) {
    return res.status(200).json({
      success: true,
      message: "Profile update successfully",
      data: userData,
    });
  }
};

const uploadProfilePicture = async (req, res) => {
  const { user, body } = req;
  const imageData = body.image;
  if (!imageData) {
    return res.status(400).json({ message: "Base64 string is required." });
  }
  // const mimeMatch = imageData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
  //   const mimeType = mimeMatch[1];
  //   console.log(mimeType !== 'image/jpeg');
  //   if (mimeType !== 'image/jpeg') {
  //     return res.status(400).json({
  //       message: 'Invalid mime type'
  //     })
  //   }
  const imageName = `IMG_${user._id}.jpg`;
  const imagepath = __dirname + "/../../public/user-images/";
  if (!fs.existsSync(imagepath)) {
    fs.mkdirSync(imagepath);
  }
  const resultImage = imagepath + imageName;
  const imageBuffer = Buffer.from(imageData.split(",")[1], "base64");
  fs.writeFileSync(path.join(resultImage), imageBuffer);
  const uploadData = await authModel.findByIdAndUpdate(
    { _id: user._id },
    { image: "/user-images/" + imageName },
    { new: true }
  );
  return res.status(200).json({
    success: true,
    data: uploadData,
    message: "image upload successfully",
  });
};

const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const current_user = req.user;
    const user = await authModel.findById(current_user._id).select("+password");
    if (bcrypt.compareSync(old_password, user.password)) {
      const hashPassword = bcrypt.hashSync(new_password, 10);
      await authModel.updateOne(
        {
          _id: current_user._id,
        },
        {
          password: hashPassword,
        }
      );
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "old Password not matched",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await authModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  sendOtpEmal(user);
  return res.status(200).json({
    success: true,
    message: "Otp sent successfully",
  });
};

const verifyEmailOtp = async (req, res) => {
  const { body } = req;
  const user = await authModel.findOne({ email: body.email });
  const otpData = await otpModel.findOne({
    userId: user._id,
    emailOtp: body.otp,
  });
  if (otpData && otpData.emailOtp === body.otp) {
    await otpModel.deleteMany({ userId: user._id });
    return res.status(200).json({
      success: true,
      message: "Otp verified successfully",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid Otp, please try again",
    });
  }
};

const setNewPassword = async (req, res) => {
  const { body } = req;
  const newPassword = body.newPassword;
  const password = body.password;
  const hashPassword = bcrypt.hashSync(password, 10);
  try {
    const user = await authModel.findOne({ email: body.email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
    if (newPassword === password) {
      await authModel.updateOne(
        {
          _id: user._id,
        },
        {
          password: hashPassword,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "New password and Confirm password does't match",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyAccount = async (req, res) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : "";
  const auth = jwt.verify(token, process.env.JWT_SECRET);
  const { otp_email, otp_phone } = req.body;
  const filter = { _id: auth._id };
  const update = { verified: true };
  const otpData = await otpModel
    .findOne({ userId: auth._id, emailOtp: otp_email })
    .sort({ _id: -1 });
  if (otpData && otpData.emailOtp === otp_email) {
    if (otpData && otpData.phoneOtp === otp_phone) {
      await authModel.findOneAndUpdate(filter, update, { new: true });
      await otpModel.deleteMany({ userId: auth._id });
      return res.status(200).json({
        success: true,
        message: "Otp verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid phone Otp",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid email Otp",
    });
  }
};

const resetEmailOtp = async (req, res) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : "";
  const auth = jwt.verify(token, process.env.JWT_SECRET);
  const otpEmail = generateOtp();
  const otpData = await otpModel.findOne({ userId: auth._id });
  if (otpData) {
    otpData.emailOtp = otpEmail;
    await otpData.save();
  }
  const mailOptions = {
    subject: "RESEND OTP FOR EMAIL",
    email: auth.email,
    data: {
      otp: otpData,
    },
    template: "templates/resend-email-otp.ejs",
  };
  const nodeMailer = new NodeMailer(mailOptions);
  const dd = await nodeMailer.sentMail();

  setTimeout(() => {
    otpModel
      .findOneAndUpdate(
        { userId: auth._id },
        { emailOtp: null, phoneOtp: null },
        { new: true }
      )
      .then((val) => console.log(val));
  }, 60000 * 5);

  return res.status(200).json({
    success: true,
    message: "Otp send successfully",
  });
};

const resetPhoneOtp = async (req, res) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : "";
  const auth = jwt.verify(token, process.env.JWT_SECRET);
  const otpPhone = generateOtp();
  const otpData = await otpModel.findOne({ userId: auth._id });
  if (otpData) {
    otpData.phoneOtp = otpPhone;
    await otpData.save();
  }
  const mailOptions = {
    subject: "RESEND OTP FOR PHONE",
    email: auth.email,
    data: {
      otp: otpData,
    },
    template: "templates/resend-phone-otp.ejs",
  };
  const nodeMailer = new NodeMailer(mailOptions);
  await nodeMailer.sentMail();

  setTimeout(() => {
    otpModel
      .findOneAndUpdate(
        { userId: auth._id },
        { emailOtp: null, phoneOtp: null },
        { new: true }
      )
      .then((val) => console.log(val));
  }, 60000 * 5);

  return res.status(200).json({
    success: true,
    message: "Otp send successfully",
  });
};

const sendOtp = async (user) => {
  const phone = user.phone;
  const otpEmail = generateOtp();
  const otpPhone = generateOtp();
  try {
    const saveOtp = new otpModel({
      userId: user._id,
      emailOtp: otpEmail,
      phoneOtp: otpPhone,
      otpType: "signup",
    });
    await saveOtp.save();
    const mailOptions = {
      subject: "ACCOUNT VERIFICATION",
      email: user.email,
      data: {
        otp: saveOtp,
      },
      template: "templates/email-innov.ejs",
    };
    const nodeMailer = new NodeMailer(mailOptions);
    await nodeMailer.sentMail();
    const dd = await sendSMS();
    console.log(dd, "-------");
  } catch (error) {
    console.log(error);
    return error;
  }
};

const sendOtpEmal = async (user) => {
  const otpEmail = generateOtp();
  try {
    const saveOtp = new otpModel({
      userId: user._id,
      emailOtp: otpEmail,
      otpType: "resetpassword",
    });
    await saveOtp.save();
    const mailOptions = {
      subject: "ACCOUNT VERIFICATION",
      email: user.email,
      data: {
        otp: saveOtp,
      },
      template: "templates/email-innov.ejs",
    };
    const nodeMailer = new NodeMailer(mailOptions);
    await nodeMailer.sentMail();
    const dd = await sendSMS();
    console.log(dd, "-------");
  } catch (error) {
    console.log(error);
    return error;
  }
};

const uploadPortfolio = async (req, res) => {
  const { user, files, body } = req;
  if (body.portfolioLink) {
    try {
      const savedData = await authModel.findOneAndUpdate(
        { _id: user._id },
        { portfolioLink: body.portfolioLink },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: 'Portfolio updated successfully',
        data: savedData
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Portfolio updated successfully',
        data: null
      });
    }
  }
  let saveduser;
  if (!files || Object.keys(files).length === 0) {
    return res
      .status(400)
      .json({ success: false, data: {}, message: "No files were uploaded." });
  }
  const fileBuffer = Array.isArray(files.files) ? files.files : [files.files];
  const dir = __dirname + "/../../public/user-portfolio/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let savedCount = 0;
  let unsavedCount = 0;
  for (let i of fileBuffer) {
    if (i.size > 250000000) {
      unsavedCount++;
      return res.status(400).json({
        success: false,
        data: {},
        message: `${unsavedCount} File too Big, please select a file less than 25mb`,
      });
    }
    const allowedMimeTypes = [
      "application/pdf",
      "video/mp4",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (allowedMimeTypes.includes(i.mimetype.toLowerCase())) {
      const name = user._id + "-" + i.name;
      const path = dir + name;
      await i.mv(path);
      try {
        saveduser = await authModel.findOneAndUpdate(
          { _id: user._id },
          { $push: { portfolio: `/user-portfolio/${name}` } },
          { new: true }
        );
        savedCount++;
      } catch (error) {
        unsavedCount++;
        return res.status(500).json({
          success: false,
          data: {},
          message: `Error while saving the files count of ${unsavedCount}.`,
        });
      }
    } else {
      unsavedCount++;
      return res.status(200).json({
        success: false,
        data: saveduser,
        message: `${unsavedCount} Invalid unsave file type, and saved count is ${savedCount}`,
      });
    }
  }
  res.status(200).json({
    success: true,
    data: saveduser,
    message: `${savedCount} Files uploaded successfully`,
  });
};

module.exports = {
  register,
  profile,
  login,
  getMe,
  editProfile,
  uploadProfilePicture,
  changePassword,
  forgetPassword,
  verifyEmailOtp,
  setNewPassword,
  verifyAccount,
  resetEmailOtp,
  resetPhoneOtp,
  uploadPortfolio,
};
