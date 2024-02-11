const { Schema, model } = require('mongoose')

const schema = Schema({
    className: { type: String, default: null },
    user: { type: Schema.Types.ObjectId, ref: "Auth" },
    board: { type: String, default: null },
    status: { type: Boolean, default: true },
    createdAt: {
        type: Date,
        default: Date.now,
      }
});

module.exports = model('userEducation', schema);