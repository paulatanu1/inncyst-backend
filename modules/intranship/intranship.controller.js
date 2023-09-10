const intranshipModel = require("./intranship.model");
const { intranshipRequest } = require("../../middlewares/validator");
const userType = require("../common/userType");

const intranshipController = {
  getAll: async (req, res) => {
    const { user, query, params } = req;
    const filter = {
      status: true
    };

if (query) {
  if (query.type) {
    filter.intranshipType = query.type
  }
  if (query.jobType) {
    filter.jobType = query.jobType
  }
  if (query.location) {
    filter.location = query.location;
  }
  if (query.salary) {
    filter.salary = { $lt: query.salary }
  }
  if (query.sort && query.sort === 'asc') {
    query.sort = { _id: 1 };
  }
  if (query.sort && query.sort === 'dsc') {
    query.sort = { _id: -1 };
  }
}
    if (user.role !== 'student') {
      filter.industryId = user._id;
    }
    const intranshipList = await intranshipModel.find(filter).populate('industryId').sort(query.sort);
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
      message: "Saved a Job successfully",
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
        message: "Job not found",
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
