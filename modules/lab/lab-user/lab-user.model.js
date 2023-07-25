const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userType = require("../../common/userType");

const LabUserSchema = new mongoose.Schema(
  {
    labname: {
      type: String,
      trim: true,
      min: 6,
    },
    fname: {
      type: String,
      trim: true,
    },
    lname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email id is required"],
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 10,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
    },
    invitation_status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected"],
    },
    firstTimer: { type: Boolean, default: true },
    street: String,
    area: String,
    state: String,
    city: String,
    pincode: {
      type: Number,
      maxlength: 6,
    },
    tokens: [{ token: String, timestamps: Date }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    temporaryPassword: String,
  },
  { timestamps: true }
);

LabUserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

LabUserSchema.methods.getSignedJwtToken = function () {
  const token = jwt.sign(
    { id: this._id, userType: userType.LAB },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
  return token;
};

LabUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("LabUserSchema", LabUserSchema);
