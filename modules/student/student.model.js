const { Schema, model } = require('mongoose');

const studentSchema = Schema({
    intranshipId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Auth' },
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resume: { type: String, required: true },
    availability: { type: Number, default: 1 },
    status: { type: Boolean, default: true },
    applicationStatus: { type: String, enum: ['pending', 'review', 'complete'], default: 'pending' },
    availability_message: { type: String, default: null }
});

module.exports = model("student", studentSchema);