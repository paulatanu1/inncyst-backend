const intranshipModel = require("./intranship.model");
const { intranshipRequest } = require("../../middlewares/validator");
const userType = require("../common/userType");

const intranshipController = {
  getAll: async (req, res) => {
    const { user, query, params } = req;
    const filter = {
      industryId: user._id,
      $or: [
        { intranshipType: query.type },
        { jobType: query.jobType },
        { location: query.location },
        { salary: { $lt: query.salary } },
      ],
    };
    const intranshipList = await intranshipModel.find(filter);
    return res.status(200).json({
      success: true,
      message: "",
      data: intranshipList,
    });
  },

  getById: async (req, res) => {
    const { user, params } = req;
    const getData = await intranshipModel.findOne({_id: params.id});
    if (!getData) {
        return res.status(400).json({
            success: false,
            data: {},
            message: 'No data found'
        });
    }
    return res.status(200).json({
        success: true,
        data: getData,
        message: ''
    });
  },

  postIntranship: async (req, res) => {
    const { user, body } = req;
    const { error } = intranshipRequest(body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    const saveData = new intranshipModel({
      industryId: user._id,
      companyName: body.companyName,
      intranshipName: body.intranshipName,
      intranshipType: body.intranshipType,
      location: body.location,
      skills: body.skills,
      jobType: body.jobType,
      salary: body.salary,
      information: body.information,
      opens: body.opens,
    });
    const data = await saveData.save();
    return res.status(200).json({
      success: true,
      message: "Saved intranship successfully",
      data: data,
    });
  },

  editIntranship: async (req, res) => {
    const { body, params } = req;
    const filter = { _id: params.intranshipId };
    const intranshipData = await intranshipModel.findOneAndUpdate(
      filter,
      body,
      {
        new: true,
      }
    );
    if (intranshipData) {
      return res.status(200).json({
        success: true,
        message: "Update successfully",
        data: intranshipData,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Something wrong",
    });
  },

  deleteIntranship: async (req, res) => {
    const { user, params } = req;
    const filter = { _id: params.intranshipId };
    if (user.role === userType.INDUSTRY) {
      filter.industryId = user._id;
    }
    const findData = await intranshipModel.findOne(filter);
    if (!findData) {
      return res.status(400).json({
        success: false,
        message: "Intranship not found",
        data: {},
      });
    }
    await intranshipModel.deleteOne(filter);
    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  },
};

module.exports = intranshipController;
