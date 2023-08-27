const { Schema, model} = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userType = require("../common/userType");

const authSchema = Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        min: 6,
      },
      email: {
        type: String,
        required: [true, "Email id is required"],
      },
      phone: {
        type: String,
        trim: true,
        maxlength: 15,
      },
      image: {
        type: String,
        default: null
      },
      role: {
        type: String,
        enum: [userType.INTERN, userType.JOB, userType.STUDENT, userType.INDUSTRY, userType.EXPART, userType.LAB, userType.MANUFACTURER],
        default: userType.STUDENT,
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        select: false,
      },
      description: {
        type: String,
        default: null,
        maxlength: 100
      },
      verified: { type: Boolean, default: false },
      question_step: { type: Boolean, default: false },
      status: { type: Boolean, default: true },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
      createdAt: {
        type: Date,
        default: Date.now,
      },
});

authSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  authSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES
    });
  };
  
  authSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

module.exports = model("Auth", authSchema);