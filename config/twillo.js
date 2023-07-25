const TWILIO_ACCOUNT_SID = "ACb2ce056d1693a29c7d1d77e30523f3ca";
const TWILIO_AUTH_TOKEN = "e0ddc0c3b45c5294f2e8e1d66035532f";
const TWILLO_MESSAGING_SERVICE_SID = "MG79ac7af65b638b51be2b262914594d0b";
const TWILO_PHONE_NUMBER = "+19895020612";

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendSMS = async (phoneNumber, message) => {
  return await client.messages.create({
    to: phoneNumber,
    messagingServiceSid: TWILLO_MESSAGING_SERVICE_SID,
    body: message,
  });
};

module.exports = {
  sendSMS,
};
