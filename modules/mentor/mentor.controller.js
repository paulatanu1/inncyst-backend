const mentorModel = require("./about.model");
const mentorContactModel = require("./contact.model");
const mentorExprienceModel = require("./experience.model");
const mentorSkills = require('./skills.model');

class Mentor {
  static async getMentorAbout(req, res) {
    try {
      const { user } = req;
      const findData = await mentorModel.findOne({
        user: user._id,
        status: true,
      });
      if (!findData) {
        return res.status(200).json({
          status: true,
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
        const updatedData = await mentorModel.findOneAndUpdate(filter, body, { new: true });
        return res.status(200).json({
          status: true,
          data: updatedData,
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

  static async getAllMentorExpireances(req, res) {
    const { user } = req;
    const filter = { user: user._id, status: true };
    let $orConditions = [];

    if (req.query.q) {
      const searchCriteria = { $regex: query.q, $options: "i" };
      $orConditions.push({ startDate: searchCriteria });
    }
    if ($orConditions.length) {
      filter.$or = $orConditions;
    }
    const findDatas = await mentorExprienceModel.find(filter);
    return res.status(200).json({
      success: true,
      data: findDatas,
      message: "",
    });
  }

  static async getMntorExpById(req, res) {
    const { id } = req.params;
    const { user } = req;
    const mentorExp = await mentorExprienceModel.findOne({
      user: user._id,
      _id: id,
    });
    if (!mentorExp) {
      return res.status(400).json({
        status: false,
        data: null,
        message: "Data not found",
      });
    }
    return res.status(200).json({
      status: true,
      data: mentorExp,
      message: "",
    });
  }

  static async deleteMentorExp(req, res) {
    const { id } = req.params;
    const isExists = await mentorExprienceModel.findOne({ _id: id });
    if (!isExists) {
      return res.status(400).json({
        success: false,
        data: null,
        messgae: "Unable to delete",
      });
    }
    await mentorExprienceModel.deleteOne({ _id: id });
    return res.status(200).json({
      success: true,
      data: null,
      messgae: "Expireance deleted successfully",
    });
  }

  static async addMentorExpireance(req, res) {
    try {
      const { user, body } = req;
      const addExpData = new mentorExprienceModel({
        user: user._id,
        ...body,
      });
      const savedData = await addExpData.save();
      return res.status(200).json({
        success: true,
        data: savedData,
        messgae: "Expireance add successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: null,
        messgae: "Unable to add exp",
      });
    }
  }

  static async updateMentorExpireance(req, res) {
    try {
      const { id } = req.params;
      const { user, body } = req;
      const isExists = await mentorExprienceModel.findOne({ _id: id });
      if (!isExists) {
        return res.status(400).json({
          success: false,
          data: null,
          messgae: "Unable to update",
        });
      }
      const filter = { user: user._id, _id: id };
      const updateMentorExpireance =
        await mentorExprienceModel.findOneAndUpdate(filter, body, {
          new: true,
        });
      return res.status(200).json({
        success: true,
        data: updateMentorExpireance,
        messgae: "Expireance update successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: null,
        messgae: "Unable to update exp",
      });
    }
  }

  static async skillsList(req, res) {
    try {
      
    } catch (error) {
      
    }
  }
}

module.exports = Mentor;
