const Joi = require('joi');

const requirementSchema = Joi.object({
    activity: Joi.number().required(),
    numTimes: Joi.number().required(),
    totalTimes: Joi.number().required(),
    condition: Joi.object().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
});

const taskSchema = Joi.object({
    activity: Joi.number().required(),
    beneficiary: Joi.string().required(),
    depositor: Joi.string().required(),
    hashCondition: Joi.string().required(),
    numTimes: Joi.number().required(),
    totalTimes: Joi.number().required(),
    condition: Joi.object().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    rewards: Joi.number().required()
});

function validateRequirementBody(req, res, next) {
    const { error } = requirementSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

function validateTaskBody(req, res, next) {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}


module.exports = {validateRequirementBody, validateTaskBody}