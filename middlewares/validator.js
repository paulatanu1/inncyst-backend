const Joi = require('joi');

const VALIDATIONS = {
    EMAIL: Joi.string().email().required(),
    PASSWORD: Joi.string().required(),
    NAME: Joi.string().required(),
    PHONE_NUMBER: Joi.string().min(6).max(15).required(),
    NUMBER_REQUIRED: Joi.number().required(),
    STRING_REQUIRED: Joi.string().required(),
    BOOLEAN_REQUIRED: Joi.boolean().required(),
    VAT: Joi.string().required().min(8).max(13),
    REQUIRED: Joi.required(),
    STRING: Joi.string(),
    ANY: Joi.any(),
    ARRAY: Joi.array().items(Joi.string())
}

class Validator {
    static industryQuestions(params) {
        const schema = Joi.object().keys({
            industryId: VALIDATIONS.STRING_REQUIRED,
            companyName: VALIDATIONS.STRING_REQUIRED,
            companyEstdYear: VALIDATIONS.STRING_REQUIRED,
            aboutCompany: VALIDATIONS.STRING_REQUIRED,
            empCount: VALIDATIONS.NUMBER_REQUIRED,
            workPlace: VALIDATIONS.STRING_REQUIRED,
            salaryPackege: VALIDATIONS.STRING_REQUIRED
        });
        return schema.validate(params);
    }

    static manufacturerQuestion(params) {
        const schema = Joi.object().keys({
            manufacturerId: VALIDATIONS.STRING_REQUIRED,
            companyName: VALIDATIONS.STRING_REQUIRED,
            companyEstdYear: VALIDATIONS.STRING_REQUIRED,
            aboutCompany: VALIDATIONS.STRING_REQUIRED,
            empCount: VALIDATIONS.NUMBER_REQUIRED,
            workPlace: VALIDATIONS.STRING_REQUIRED,
            facilitiesWithPrice: VALIDATIONS.STRING_REQUIRED
        });
        return schema.validate(params);
    }

    static intranshipRequest(params) {
        const schema = Joi.object().keys({
            companyName: VALIDATIONS.STRING_REQUIRED,
            intranshipName: VALIDATIONS.STRING_REQUIRED,
            intranshipType: VALIDATIONS.STRING_REQUIRED,
            location: VALIDATIONS.STRING_REQUIRED,
            skills: VALIDATIONS.ARRAY,
            jobType: VALIDATIONS.STRING_REQUIRED,
            salary: VALIDATIONS.STRING_REQUIRED,
            information: VALIDATIONS.STRING_REQUIRED,
            opens: VALIDATIONS.NUMBER_REQUIRED
        });
        return schema.validate(params);
    }

    static applyForIntranship(params) {
        const schema = Joi.object().keys({
            email: VALIDATIONS.EMAIL,
            phone: VALIDATIONS.PHONE_NUMBER
        });
        return schema.validate(params);
    }
}

module.exports = Validator;