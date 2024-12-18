import { ApiError } from "../utils/apiError.js";
import {BAD_REQUEST} from "../utils/responseCode.js"
import { i18n } from "../utils/i18n.js";

const validateSignupForEmail = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
        confirmPassword: Joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateSignupForPhone = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
        countryCode: Joi.string().required(),
        phoneNo: Joi.string().pattern(/^[0-9\-\(\)\s]+$/).required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateVerifyOTP = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
       email: joi.string().email().optional(),
       otp: joi.string().required(),
       countryCode: joi.string().optional(),
       phone: joi.string().optional()

    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}


const User= {
    validateSignupForEmail,
    validateVerifyOTP,
    validateSignupForPhone
}
export default User;
    