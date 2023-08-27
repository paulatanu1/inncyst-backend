const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authModel = require("./auth.model");
const otpModel = require("./otp.model");
const { transporter } = require("../../config/email");
const { generateOtp } = require("../../config/otp");
const { sendSMS } = require("../../config/fast2sms");
const { NodeMailer } = require("../../config/Mailer");
const fs = require("fs");

const register = async (req, res) => {
  const { role, name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Provide details for register",
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

const login = async (req, res) => {
  const { email, password, role } = req.body;
  if (!(email && password)) {
    return res.status(400).json({
      success: false,
      message: "All inputs are required",
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
  const { user, body} = req;
  const userData = await authModel.findOneAndUpdate(
    { _id: user._id},
    body,
    { new: true },
  );
  if (userData) {
    return res.status(200).json({
      success: true,
      message: "Profile update successfully",
      data: userData
    })
  }
}

const uploadProfilePicture = async (req, res) => {
  const { user, body, files } = req;
  if (files && files.image) {
    if (
      files.image.mimetype === 'image/png' ||
      files.image.mimetype === 'image/jpg' ||
      files.image.mimetype === 'image/jpeg'
    ) {
      const dir = __dirname + "/../../public/user-images/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const name =
        Math.random().toString(36).substring(2, 50) +
        "." +
        files.image.name.split(".").pop();
      const path = dir + name;
      await files.image.mv(path);
      const uploadData = await authModel.findByIdAndUpdate(
        { _id: user._id },
        { image: "/user-images/" + name },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        data: uploadData,
        message: "image upload successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Invalid Image type!",
      });
    }
  }
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
  const phone  = user.phone;
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

module.exports = {
  register,
  login,
  getMe,
  editProfile,
  uploadProfilePicture,
  changePassword,
  verifyAccount,
  resetEmailOtp,
  resetPhoneOtp,
};
