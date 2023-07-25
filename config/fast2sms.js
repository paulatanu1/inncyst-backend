const fetch = require("isomorphic-fetch");

const API_KEY =
  "VF7RgPqBf9JQAwGKlkmv2WayCxjhMrbeIS6dT14sZt3inHONYzKUEm8TByuDQ1vXinAOsNfrCM7zbZh0";
// const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${API_KEY}&variables_values=5599&route=otp&numbers=9999999999,8888888888,7777777777`

const sendSMS = async (message = "", numbers = []) => {
  const endpoint = "https://www.fast2sms.com/dev/bulkV2";
  const queries = {
    authorization: API_KEY,
    variables_values: message,
    route: "otp",
    numbers: numbers.join(","),
  };

  const queryString = Object.entries(queries)
    .map((query) => `${query[0]}=${query[1]}`)
    .join("&");
  const url = endpoint + "?" + queryString;
  console.log(url)
  return await(await fetch(url)).json();
};

module.exports = { sendSMS };
