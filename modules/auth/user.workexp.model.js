const { Schema, model } = require('mongoose')

const schema = Schema({
    designation: { type: String },
    companyName: { type: String },
    duration: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "Auth" },
    description: {
        type: String,
        default: null,
        maxlength: 100
      },
    status: { type: Boolean, default: true },
    createdAt: {
        type: Date,
        default: Date.now,
      }
});

module.exports = model('userWorkExperience', schema);