const sendTokenResponse = (token, statusCode, res, loginType, extraResponse) => {

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  return res
    .status(statusCode)
    .cookie("Authorization", `Bearer ${token}`, options)
    .cookie("Role", loginType, options)
    .json({
      data: { token, ...extraResponse },
      success: true,
    });
};

module.exports = sendTokenResponse;
