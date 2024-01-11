const fetch = require("isomorphic-fetch");

const API_KEY =
  "voAWPEZfYeSOl9kTLu470FJrKqUV68HMsyR23xDgXbtCNwcGIBJWqj0axZ6Es3RPCSAfDncX1QFNvy54";
const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${API_KEY}&variables_values=5599&route=otp&numbers=9999999999,8888888888,7777777777`

const sendSMS = async (otp, number) => {
  const endpoint = "https://www.fast2sms.com/dev/bulkV2";
  const queries = {
    authorization: API_KEY,
    variables_values: `Hi, your otp for account verification is ${otp}`,
    route: "otp",
    numbers: [number],
  };

  const queryString = Object.entries(queries)
    .map((query) => `${query[0]}=${query[1]}`)
    .join("&");
  const url = endpoint + "?" + queryString;
  return await(await fetch(url)).json();
};

module.exports = { sendSMS };
