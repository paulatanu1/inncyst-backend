const contactModel = require("./contact.model");
const { contactUs } = require("../../../middlewares/validator");

const contactController = {
  getAll: async (req, res) => {
    try {
      const contact = await contactModel.find({ status: true });
      return res.status(200).json({
        success: true,
        data: contact,
        message: "Success",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: null,
        message: "Error: " + error.message,
      });
    }
  },

  postContactUs: async (req, res) => {
    const { body } = req;
    try {
      const { error: errorResponse } = contactUs(body);
      if (errorResponse) {
        return res.status(400).json({
          success: false,
          data: null,
          message: errorResponse.message,
        });
      }
      const contactUsData = new contactModel(body);
      const savedData = await contactUsData.save();
      return res.status(200).json({
        success: true,
        data: savedData,
        message: "Saved successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: true,
        data: null,
        message: "Something wrong happened",
      });
    }
  },

  getById: async (req, res) => {
    const { params } = req;
    try {
      const contactData = await contactModel.findOne({ _id: params.id });
      if (contactData) {
        return res.status(200).json({
          success: true,
          data: contactData,
          message: "Success",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Something wrong happened",
      });
    }
  },
};

module.exports = contactController;
