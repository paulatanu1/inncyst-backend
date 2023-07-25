const TalentProfile = require("./profile.model");
const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");

const createTalentProfile = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  if (!userId) {
    return next(new ErrorResponse("Missing fields", 400));
  }
  const profile = await TalentProfile.create({
    personal_details: { ...req.body },
    user: userId,
  });
  return res.status(201).send({
    status: true,
    data: profile,
  });
});

const updateTalentProfile = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { field } = req.query;

  console.log("fields", field, req.body);
  if (!userId || !field) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  let profile;

  if (["educational_details", "work_experience", "skills", "projects"].includes(field)) {
    profile = await TalentProfile.findOneAndUpdate(
      { user: userId },
      { $push: { [field]: req.body } },
      { new: true, upsert: true }
    );
  } else {
    profile = await TalentProfile.findOneAndUpdate(
      { user: userId },
      { [field]: req.body },
      { new: true, upsert: true }
    );
  }

  return res.status(200).send({
    status: true,
    data: profile,
  });
});

const getTalentProfile = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  if (!userId) {
    return next(new ErrorResponse("Missing fields", 400));
  }

  const profile = await TalentProfile.findOne({ user: userId });

  return res.status(200).send({
    status: true,
    data: profile,
  });
});

module.exports = { createTalentProfile, updateTalentProfile, getTalentProfile };
