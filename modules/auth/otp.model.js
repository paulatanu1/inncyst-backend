const { Schema, model} = require("mongoose");

const otpSchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Auth'},
    emailOtp: { type: String },
    phoneOtp: { type: String },
    otpType: {
        type: String,
        enum: ['signup', 'resetpassword']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = model("Otpmodel", otpSchema);