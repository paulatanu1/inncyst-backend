const manufacturerModel = require('./manufacturer.model');
const {manufacturerQuestion} = require('../../middlewares/validator');

const manufacturerQuestions = async (req, res) => {
    const {body} = req;
    const { error } = manufacturerQuestion(body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    const manufacturerQuestions = new manufacturerModel(body);
    const saveQuestions = await manufacturerQuestions.save();
    if(saveQuestions) {
        return res.status(200).json({
            success: true,
            data: saveQuestions,
            message: 'Questions saved.'
        });
    }
    return res.status(400).json({
        success: false,
        data: {},
        message: 'Something Wrong'
    });
}

module.exports = {manufacturerQuestions}