const {Schema, model} = require('mongoose');

const manufacturerSchema = Schema({
    manufacturerId: {type: Schema.Types.ObjectId, ref: 'Auth'},
    companyName: {type: String, required: true},
    companyEstdYear: {type: String, required: true},
    aboutCompany: {type: String, required: true},
    empCount: {type: Number, required: true},
    workPlace: {type: String, required: true},
    facilitiesWithPrice: {type: String, required: true},
    createdAt: {
        type: Date,
        default: Date.now,
      }
});

module.exports = model('manufacturer', manufacturerSchema);