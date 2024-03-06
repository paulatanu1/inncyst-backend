const fetch = require("isomorphic-fetch");

const API_KEY = "gY4CM5q3JS0H8tiVflNTaDxbokzIeypGP9KOLdvw7REsU1ZFnhnHVqucpM7NUZSQiw5mTCKL34Bh8a19";
  // "gY4CM5q3JS0H8tiVflNTaDxbokzIeypGP9KOLdvw7REsU1ZFnhnHVqucpM7NUZSQiw5mTCKL34Bh8a19";
const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${API_KEY}&variables_values=5599&route=otp&numbers=9999999999,8888888888,7777777777`

const sendSMS = async (otp, number) => {
  const endpoint = "https://www.fast2sms.com/dev/bulkV2";
  const queries = {
    authorization: API_KEY,
    variables_values: `${otp}`,
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
