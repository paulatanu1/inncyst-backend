const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street: String,
  area: String,
  state: String,
  city: String,
  pincode: {
    type: Number,
    maxlength: 6,
  },
});

const ContactSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
  },
  altEmail: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  address: AddressSchema,
});

const PersonalDetailsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  avatar: String,
  age: Number,
  gender: {
    type: String,
  },
});

const EducationalDetailsSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  y_start: Date,
  y_end: Date,
  grade: String,
  stream: String,
});

const ProjectsSchema = new mongoose.Schema({
  projectName: String,
  description: String,
  role: String,
  y_start: Date,
  y_end: Date
});

const WorkExperienceSchema = new mongoose.Schema({
  company: String,
  y_start: Date,
  y_end: Date,
  location: String,
  skills: String,
  projects: [ProjectsSchema],
});

const SkillsSchema = new mongoose.Schema({
  skill: { type: String, unique: true },
  years: Number,
  rating: Number,
  y_start: Date,
});

const CertificationSchema = new mongoose.Schema({
  certification_name: String,
  year_of_certification: Date,
});

const TalentProfile = new mongoose.Schema({
  personal_details: PersonalDetailsSchema,
  contact_details: ContactSchema,
  availability: { type: Boolean, default: true },
  educational_details: [EducationalDetailsSchema],
  work_experience: [WorkExperienceSchema],
  skills: [SkillsSchema],
  certification: [CertificationSchema],
  projects: [ProjectsSchema],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A lab with the same user information already exists"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TalentProfile", TalentProfile);
