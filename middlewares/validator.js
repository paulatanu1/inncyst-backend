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
            password: VALIDATIONS.PASSWORD
        });
        return schema.validate(params);
    }

    static industryQuestions(params) {
        const schema = Joi.object().keys({
            companyName: VALIDATIONS.STRING_REQUIRED,
            companyEstdYear: VALIDATIONS.STRING_REQUIRED,
            aboutCompany: VALIDATIONS.STRING_REQUIRED,
            empCount: VALIDATIONS.NUMBER_REQUIRED,
            workPlace: VALIDATIONS.STRING_REQUIRED,
            image: VALIDATIONS.STRING_REQUIRED,
            branchOffice: VALIDATIONS.STRING,
            corporateOffice: VALIDATIONS.STRING
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

    static industryPostIntranship(params) {
        const schema = Joi.object().keys({
            id: VALIDATIONS.STRING,
            title: VALIDATIONS.STRING_REQUIRED,
            type: VALIDATIONS.STRING_REQUIRED,
            skills: VALIDATIONS.ARRAY_REQUIRED,
            details: VALIDATIONS.STRING_REQUIRED,
            intranshipType: VALIDATIONS.STRING_REQUIRED,
            startDate: VALIDATIONS.STRING_REQUIRED,
            duration: VALIDATIONS.STRING_REQUIRED,
            durationIn: VALIDATIONS.STRING_REQUIRED,
                    // education: VALIDATIONS.STRING_REQUIRED,
            jobOpening: VALIDATIONS.NUMBER_REQUIRED,
            stipend: VALIDATIONS.STRING_REQUIRED,
            salary: VALIDATIONS.NUMBER_REQUIRED,
            salaryIn: VALIDATIONS.NUMBER_REQUIRED,
            salaryType: VALIDATIONS.STRING_REQUIRED,
            perks: VALIDATIONS.ARRAY_REQUIRED,
            location: VALIDATIONS.STRING_REQUIRED,
            status: VALIDATIONS.BOOLEAN_REQUIRED,
            letter: VALIDATIONS.ANY,
            availability: VALIDATIONS.ANY,
            moreQuestions: VALIDATIONS.ANY,
            addtionalCandidatePreference: VALIDATIONS.STRING_REQUIRED,
            alternativePhone: VALIDATIONS.STRING_REQUIRED,
                    // description: VALIDATIONS.STRING_REQUIRED,
            jobType: VALIDATIONS.STRING_REQUIRED,
            responsiblity: VALIDATIONS.ANY,
            womanRestart: VALIDATIONS.STRING_REQUIRED,
                    // salaryCtcDescription: Joi.object().keys({
                    //     currency: VALIDATIONS.STRING_REQUIRED,
                    //     ctcFrom: VALIDATIONS.STRING_REQUIRED,
                    //     ctcTo: VALIDATIONS.STRING_REQUIRED,
                    //     ctcType: VALIDATIONS.STRING_REQUIRED,
                    //     isProbationPeriod: VALIDATIONS.STRING_REQUIRED,
                    //     perks: VALIDATIONS.ARRAY_REQUIRED
                    // })
        });
        return schema.validate(params);
    }

    static industryPostJob(params) {
        const schema = Joi.object().keys({
            id: VALIDATIONS.STRING,
            title: VALIDATIONS.STRING_REQUIRED,
            type: VALIDATIONS.STRING_REQUIRED,
            skills: VALIDATIONS.ARRAY_REQUIRED,
            details: VALIDATIONS.STRING_REQUIRED,
            intranshipType: VALIDATIONS.STRING_REQUIRED,
            // duration: VALIDATIONS.ANY,
            // durationIn: VALIDATIONS.STRING_REQUIRED,
            education: VALIDATIONS.STRING_REQUIRED,
            experience: VALIDATIONS.NUMBER_REQUIRED,
            experienceTime: VALIDATIONS.STRING_REQUIRED,
            jobOpening: VALIDATIONS.NUMBER_REQUIRED,
            responsibilities: VALIDATIONS.ANY,
            stipend: VALIDATIONS.STRING_REQUIRED,
            // salary: VALIDATIONS.NUMBER_REQUIRED,
            // salaryType: VALIDATIONS.STRING_REQUIRED,
            perks: VALIDATIONS.ARRAY_REQUIRED,
            location: VALIDATIONS.STRING_REQUIRED,
            // startDate: VALIDATIONS.ANY,
            status: VALIDATIONS.BOOLEAN_REQUIRED,
            letter: VALIDATIONS.ANY,
            availability: VALIDATIONS.ANY,
            moreQuestions: VALIDATIONS.ANY,
            // salaryIn: VALIDATIONS.NUMBER_REQUIRED,
            addtionalCandidatePreference: VALIDATIONS.STRING_REQUIRED,
            description: VALIDATIONS.STRING_REQUIRED,
            jobType: VALIDATIONS.STRING_REQUIRED,
            salaryCtcDescription: Joi.object().keys({
                currency: VALIDATIONS.STRING_REQUIRED,
                ctcFrom: VALIDATIONS.STRING_REQUIRED,
                ctcTo: VALIDATIONS.STRING_REQUIRED,
                ctcType: VALIDATIONS.STRING_REQUIRED,
                isProbationPeriod: VALIDATIONS.STRING_REQUIRED,
                perks: VALIDATIONS.ARRAY_REQUIRED
            })
        });
        return schema.validate(params);
    }

    static contactUs(params) {
        const schema = Joi.object().keys({
            name: VALIDATIONS.STRING_REQUIRED,
            email: VALIDATIONS.EMAIL,
            phone: VALIDATIONS.PHONE_NUMBER,
            message: VALIDATIONS.DESCRIPTION
        });
        return schema.validate(params);
    }

    static addAchivementBody(params) {
        const schema = Joi.object().keys({
            title: VALIDATIONS.STRING_REQUIRED,
            description: VALIDATIONS.STRING_REQUIRED,
            date: VALIDATIONS.STRING_REQUIRED,
            held: VALIDATIONS.STRING_REQUIRED
        });
        return schema.validate(params);
    }
}

module.exports = Validator;