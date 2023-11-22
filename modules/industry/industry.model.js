const {Schema, model} = require('mongoose');

const industrySchema = Schema({
    industryId: {type: Schema.Types.ObjectId, ref: 'Auth'},
    companyName: {type: String, required: true},
    companyEstdYear: {type: String, required: true},
    aboutCompany: {type: String, required: true},
    empCount: {type: Number, required: true},
    workPlace: {type: String, required: true},
    status: { type: Boolean, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
      }
});

module.exports = model('industry', industrySchema);