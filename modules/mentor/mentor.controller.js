const mentorModel = require("./about.model");
const mentorContactModel = require("./contact.model");

class Mentor {
  static async getMentorAbout(req, res) {
    try {
      const { user } = req;
      const findData = await mentorModel.findOne({
        user: user._id,
        status: true,
      });
      if (!findData) {
        return res.status(400).json({
          status: false,
          data: {},
          message: "Data not found!",
        });
      }
      return res.status(200).json({
        status: true,
        data: findData,
        message: "",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something wrong",
      });
    }
  }

  static async addOrUpdateAbout(req, res) {
    try {
      const { user, body } = req;
      const findData = await mentorModel.findOne({
        user: user._id,
        status: true,
      });

      if (findData) {
        const filter = { user: user._id };
        await mentorModel.findOneAndUpdate(filter, body, { new: true });
        return res.status(200).json({
          status: true,
          data: findData,
          message: "Profile About update successfully",
        });
      } else {
        const saveData = new mentorModel({
          user: user._id,
          ...body,
        });
        const saveMentorAbout = await saveData.save();
        if (saveMentorAbout) {
          return res.status(200).json({
            status: true,
            data: saveMentorAbout,
            message: "Mentor about saved successfully",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something wrong",
      });
    }
  }

  static async getMentorContact(req, res) {
    try {
      const { user } = req;
      const findData = await mentorContactModel.findOne({
        user: user._id,
        status: true,
      });
      if (!findData) {
        return res.status(400).json({
          success: false,
          message: "Data not found",
          data: null,
        });
      }
      return res.status(200).json({
        success: true,
        message: "",
        data: findData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something wrong",
      });
    }
  }

  static async addOrUpdateContact(req, res) {
    try {
      const { user, body } = req;
      const filter = { user: user._id, status: true };
      const findData = await mentorContactModel.findOne(filter);
      if (findData) {
        await mentorContactModel.findOneAndUpdate(filter, body, { new: true });
        return res.status(200).json({
          success: true,
          data: findData,
          message: "Mentor contact update successfully",
        });
      } else {
        const contact = new mentorContactModel({
          user: user._id,
          ...body,
        });
        const savedContact = await contact.save();
        if (savedContact) {
          return res.status(200).json({
            success: true,
            data: savedContact,
            message: "Mentor contact saved successfully",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something wrong",
      });
    }
  }
}

module.exports = Mentor;
