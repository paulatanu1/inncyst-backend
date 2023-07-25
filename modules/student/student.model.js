const { Schema, model } = require('mongoose');

const studentSchema = Schema({
    intranshipId: {type: Schema.Types.ObjectId, ref: 'intranship'},
    userId: {type: Schema.Types.ObjectId, ref: 'Auth'},
    studentName: { type: String, required: true },
    // intranshipId: {type: String},
    // userId: {type: String},
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resume: { type: String, required: true },
    availability: { type: Number, default: 1 },
    availability_message: { type: String, default: null }
});

module.exports = model("student", studentSchema);