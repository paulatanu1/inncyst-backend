const { Schema, model} = require('mongoose');

const planSchema = Schema({
    addedBy: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    planId: { type: String, required: true },
    plantype: { type: String, enum: ['PERIODIC', 'ON_DEMAND'], default: 'PERIODIC' },
    planName: { type: String, required: true},
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    planMaxAmount: { type: Number, required: true},
    planCycle: { type: Number, default: 1 },
    currency: { type: String, default: "INR" },
    interval: { type: Number, default: 1 },
    period: {type: String, enum: [
        'daily',
        'weekly',
        'monthly',
        'quarterly',
        'yearly'
    ], default: 'monthly' },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
});

module.exports = model('plan', planSchema);