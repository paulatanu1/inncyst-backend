// const senOtpBySms = (otp, phoneNumber, res) => {
//     sendSMS(otp, [phoneNumber])
//       .then(() => {
//         res.status(200).send({
//           message: "OTP sent successfully",
//           status: "success",
//         });
//       })
//       .catch((error) =>
//         res.status(400).send({
//           message: `An error ocurred while performing the action`,
//           error,
//         })
//       );
//   };
  
//   const sendOTP = async (req, res, next) => {
//     const { phone } = req.body;
//     const { temporaryOtpCreatedAt, temporaryOtp } = await Users.findOne({
//       phone,
//     });
  
//     if (Date.now() - temporaryOtpCreatedAt > 30 * 1000) {
//       const otp = generateOTP(6);
//       const user = await Users.findOneAndUpdate(
//         { phone },
//         { $set: { temporaryOtp: otp, temporaryOtpCreatedAt: Date.now() } },
//         { new: true }
//       );
//       senOtpBySms(otp, phone, res);
//     } else {
//       senOtpBySms(temporaryOtp, phone, res);
//     }
//   };