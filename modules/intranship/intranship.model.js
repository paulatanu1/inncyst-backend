const {Schema, model} = require('mongoose');

const skillsSchema = Schema({name:  String});
const intranshipSchema = Schema({
    industryId: {type: Schema.Types.ObjectId, ref: 'Auth'},
    companyName: { type: String, required: true },
    intranshipOverView: { type: String, required: true, maxLength: 200 },
    image: { type: String, default: null },
    intranshipName: { type: String, required: true },
    intranshipType: { type: String, enum: ['designer', 'developer', 'marketing'], default: null},
    location: { type: String, require: true },
    skills: { type: Array, default: [] },
    jobType: { type: String, enum: ['full-time', 'part-time', 'work-from-home'], default: 'full-time' },
    salary: { type: String, required: true },
    information: { type: String, required: true },
    opens: { type: Number, required: true },
    perks: [],
    hasApplied: {type: Number, default: 0},
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model("intranship", intranshipSchema);