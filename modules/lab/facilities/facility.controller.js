const Facilities = require("./facility.model");
const asyncHandler = require("../../../middlewares/async.middleware");
const { ErrorResponse, SuccessResponse } = require("../../../utils");
const { ROOT_PATH } = require("../../../config");
const fs = require("fs");

const createFacility = asyncHandler(async (req, res, next) => {
  try {
    const { user, body, files } = req;
    console.log(body, "body")
    const isExists = await Facilities.findOne({
      facilityName: body.facilityName,
    });
    if (isExists) {
      return next(new ErrorResponse("Facility already exists", 400));
    }
    const facilities = await Facilities.create({
      ...body,
      lab: user._id,
    });
    if (files && files.userManual) {
      const dir = ROOT_PATH + "/public/lab-user-manual/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const name =
        Math.random().toString(36).substring(2, 50) +
        "." +
        files.userManual.name.split(".").pop();
      const path = dir + name;
      const err = await files.userManual.mv(path);
      if (err) {
        console.log(err);
        this.message = err;
        return this.response(user, true, 400);
      }
      facilities.userManual = "/lab-user-manual/" + name;
    }
    if (files && files.image) {
      const dir = ROOT_PATH + "/public/facility-image/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const name =
        Math.random().toString(36).substring(2, 50) +
        "." +
        files.image.name.split(".").pop();
      const path = dir + name;
      const err = await files.image.mv(path);
      if (err) {
        console.log(err);
        this.message = err;
        return this.response(user, true, 400);
      }
      facilities.image = "/facility-image/" + name;
    }
    await facilities.save();
    return res.status(201).send({
      status: true,
      data: facilities,
      message: "Facility created successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      data: null,
      message: error.message || "something wrong happened",
    });
  }
});

const getFacilities = async (req, res) => {
  try {
    const { user} = req;
    const { query } = req;
    let $orConditions = [];
    const filter = {
      lab: user._id,
      status: true
    }
    if (query.q) {
      const searchCriteria = { $regex: query.q, $options: 'i' };
      $orConditions.push(
        { facilityName: searchCriteria },
        { modelNumber: searchCriteria }
      );
    }
    if ($orConditions.length) filter.$or = $orConditions;
    const facilities = await Facilities.find(filter)
      .populate("lab")
      .sort({ createdAt: -1 })
      .limit(query.limit)
      .skip(query.page * query.limit);
      const total = await Facilities.find(filter).countDocuments();
    return res.status(200).json({
      status: true,
      data: {total, items: facilities},
      message: "Facilities fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: null,
      message: error.message || "something wrong happened",
    });
  }
}

const getFacilitiesForUser = async (req, res) => {
  try {
    const { query } = req;
    let $orConditions = [];
    const filter = {
      status: true
    }
    if (query.q) {
      const searchCriteria = { $regex: query.q, $options: 'i' };
      $orConditions.push(
        { facilityName: searchCriteria },
        { modelNumber: searchCriteria }
      );
    }
    if ($orConditions.length) filter.$or = $orConditions;
    const facilities = await Facilities.find(filter)
      .populate("lab")
      .sort({ createdAt: -1 })
      .limit(query.limit)
      .skip(query.page * query.limit);
      const total = await Facilities.find(filter).countDocuments();
    return res.status(200).json({
      status: true,
      data: {total, items: facilities},
      message: "Facilities fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: null,
      message: error.message || "something wrong happened",
    });
  }
}

const updateFacility = async (req, res) => {
  try {
    const { facilityId } = req.params;
    const { body } = req;
    const facility = await Facilities.findByIdAndUpdate(facilityId, body, {
      new: true,
    });
    if (!facility) {
      return next(new ErrorResponse("Facility not found", 404));
    }
    return res.status(200).json({
      status: true,
      data: facility,
      message: "Facility updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      data: null,
      message: error.message
    });
  }
}

module.exports = { createFacility, getFacilities, getFacilitiesForUser, updateFacility };
