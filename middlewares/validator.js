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
    ARRAY: Joi.array().items(Joi.string()),
    ARRAY_REQUIRED: Joi.array().items(Joi.string()).min(1).required(),
    DESCRIPTION: Joi.string().min(1).max(200).required(),
}

class Validator {
    static registratonRequest(params) {
        const schema = Joi.object().keys({
            name: VALIDATIONS.NAME,
            role: VALIDATIONS.STRING_REQUIRED,
            email: VALIDATIONS.EMAIL,
            phone: VALIDATIONS.PHONE_NUMBER,
            password: VALIDATIONS.PASSWORD
        });
        return schema.validate(params);
    }

    static loginRequests(params) {
        const schema = Joi.object().keys({
            email: VALIDATIONS.EMAIL,
            password: VALIDATIONS.PASSWORD,
            role: VALIDATIONS.STRING_REQUIRED
        });
        return schema.validate(params);
    }

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
            intranshipOverView: VALIDATIONS.DESCRIPTION,
            intranshipName: VALIDATIONS.STRING_REQUIRED,
            intranshipType: VALIDATIONS.STRING_REQUIRED,
            location: VALIDATIONS.STRING_REQUIRED,
            skills: VALIDATIONS.ARRAY,
            jobType: VALIDATIONS.STRING_REQUIRED,
            salary: VALIDATIONS.STRING_REQUIRED,
            information: VALIDATIONS.STRING_REQUIRED,
            opens: VALIDATIONS.NUMBER_REQUIRED,
            perks: VALIDATIONS.ARRAY_REQUIRED,
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

    static industryPost(params) {
        const schema = Joi.object().keys({
            id: VALIDATIONS.REQUIRED,
            type: VALIDATIONS.STRING_REQUIRED,
            skills: VALIDATIONS.ARRAY_REQUIRED,
            details: VALIDATIONS.STRING_REQUIRED,
            intranshipType: VALIDATIONS.STRING_REQUIRED,
            startDate: VALIDATIONS.STRING_REQUIRED,
            duration: VALIDATIONS.STRING_REQUIRED,
            jobOpening: VALIDATIONS.NUMBER_REQUIRED,
            responsibilities: VALIDATIONS.ARRAY_REQUIRED,
            stipend: VALIDATIONS.STRING_REQUIRED,
            salary: VALIDATIONS.NUMBER_REQUIRED,
            salaryType: VALIDATIONS.STRING_REQUIRED,
            perks: VALIDATIONS.ARRAY_REQUIRED,
            status: VALIDATIONS.BOOLEAN_REQUIRED
        });
        return schema.validate(params);
    }
}

module.exports = Validator;