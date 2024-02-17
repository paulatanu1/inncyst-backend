const { Schema, model } = require('mongoose');

const schema = Schema({
    id: { type: String, default: null },
    user: { type: Schema.Types.ObjectId, ref: "Auth" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    held: { type: String, required: true },
    status: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('studentAchivement', schema);    