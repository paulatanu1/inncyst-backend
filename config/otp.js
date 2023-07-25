const generateOtp = () => {
    var chars = "0123456789";
    var string_length = 4;
    var randomOtp = "";
    for (var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomOtp += chars.substring(rnum, rnum + 1);
    }
    return randomOtp;
}

module.exports = { generateOtp };