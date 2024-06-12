module.exports = (type) => {
  return async (req, res, next) => {
    const { user } = req;
    if (user && user.role === type) next();
    else
      res.status(403).json({
        message: "You don't have permission for this",
        data: null,
        status: 403,
        success: false,
      });
  };
};
