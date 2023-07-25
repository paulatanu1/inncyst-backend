const hash = require("object-encode");
const salt = "innov-catalyst-pvt-ltd-2022";

const encode = (obj) => {
  return hash.encode_object(obj, "base64", salt);
};

const decode = (str) => {
  return hash.decode_object(str, "base64", salt);
};

module.exports = { encode, decode };
