const Razorpay = require('razorpay');
const planModel = require('./plan.model');

const paymentGetWay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

const { createPlanValidator } = require('../../middlewares/validator');

const paymentController = {
  createPlan: async (req, res) => {
    try {
      const { body, user } = req;
      const isExist = await planModel.findOne({ planName: body.planName });
      if (isExist) {
        return res.status(400).json({
          success: false,
          message: `${body.planName} is already exists`,
          data: isExist,
        });
      }

      const { error } = createPlanValidator(body);
      if (error) {
        return res.status(400).json({
          success: false,
          data: null,
          message: error.message,
        });
      }

      const createPlan = await paymentGetWay.plans.create({
        period: body.period,
        interval: 1,
        item: {
          name: body.planName,
          amount: body.amount,
          currency: "INR",
          description: body.description,
        },
        notes: {
          notes_key_1: "Tea, Earl Grey, Hot",
          notes_key_2: "Tea, Earl Grey… decaf.",
        },
      });

      if (createPlan) {
        const createPlanInstance = new planModel(body);
        createPlanInstance.addedBy = user._id;
        createPlanInstance.planId = createPlan.id;
        const myPlan = await createPlanInstance.save();

        return res.status(200).json({
          success: true,
          message: "Plan created successfully",
          data: myPlan,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const { query } = req;
      let filter = {
        deletedAt: null,
      };
      let $orConditions = [];

      if (query.q) {
        const searchCriteria = { $regex: query.q, $options: "i" };
        $orConditions.push({ planName: searchCriteria });
      }
      if ($orConditions.length) filter.$or = $orConditions;

      const planList = await planModel
        .find(filter)
        .populate("addedBy")
        .sort(query.sort)
        .limit(query.limit)
        .skip(query.page * query.limit);

      return res.status(200).json({
        success: true,
        data: planList,
        message: "",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { params } = req;
      const planById = await planModel({
        _id: params.id,
        deletedAt: null,
      });

      if (planById) {
        return res.status(200).json({
          success: true,
          data: planById,
          message: "",
        });
      } else {
        return res.status(404).json({
          success: false,
          data: null,
          message: "Plan not found!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        data: null,
        message: error.message,
      });
    }
  },
};

module.exports = paymentController;