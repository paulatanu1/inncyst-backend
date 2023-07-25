const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const hash = require("object-encode");
const { encode } = require("../../common/object-encode-salt");
const userType = require("../../common/userType");

const OrgUserSchema = new mongoose.Schema(
  {
    orgname: {
      type: String,
      trim: true,
      min: 6,
      unique: true,
    },
    username: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      min: 6,
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
    numberOfLicensesPurchased: Number,
    referenceLink: String,
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
  },
  { timestamps: true }
);

OrgUserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.referenceLink = encode({ ...this });
});

OrgUserSchema.methods.getSignedJwtToken = function () {
  const token = jwt.sign(
    { id: this._id, userType: userType.ORGANIZATION },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
  return token;
};

OrgUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("OrgUserSchema", OrgUserSchema);
