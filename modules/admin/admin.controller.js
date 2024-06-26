const settingsModel = require("./settings.model");
const { createContentValidator } = require("../../middlewares/validator");

const adminController = {
  addContent: async (req, res) => {
    try {
      const { body } = req;
    //   const findContent = await settingsModel.findOne({ contentType: body.contentType });
    //   if (findContent) {
    //     return res.status(400).json({
    //       success: false,
    //       message: `${body.contentType} is already exists`,
    //       data: findContent,
    //     });
    //   }
      const { error } = createContentValidator(body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      const addContent = new settingsModel(body);
      const result = await addContent.save();

      if (result) {
        return res.status(200).json({
          success: true,
          data: result,
          message: "Content added successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
        data: null,
      });
    }
  },

  updateContent: async (req, res) => {
    try {
      const { body, params } = req;
      const content = await settingsModel.findOne({ _id: params.id });
      if (!content) {
        return res.status(404).json({
          success: false,
          message: "Content not found",
          data: null,
        });
      }

      body.updatedAt = Date.now();

      const updateContent = await settingsModel.findOneAndUpdate(
        { _id: params.id },
        body,
        { new: true }
      );

      if (updateContent) {
        return res.status(200).json({
          success: true,
          data: updateContent,
          message: "Content updated successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
        data: null,
      });
    }
  },

  privacyContents: async (req, res) => {
    try {
      const contents = await settingsModel.find({contentType: 'privacy' });
      if (contents) {
        return res.status(200).json({
          success: true,
          data: contents,
          message: "Contents fetched successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
        data: null,
      });
    }
  }
};

module.exports = adminController;
