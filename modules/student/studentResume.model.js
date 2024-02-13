const { Schema, model } = require('mongoose');

const schema = Schema({
    user: { type: Schema.Types.ObjectId, ref: "Auth" },
    resume: { type: String, required: true },
    status: { type: Boolean, default: true },
    uploadedDate: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('studentResume', schema);