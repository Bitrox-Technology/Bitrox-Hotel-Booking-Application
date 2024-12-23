import joi from "joi"
import { ApiError } from "../utils/apiError.js";
import { BAD_REQUEST } from "../utils/responseCode.js"
import { i18n } from "../utils/i18n.js";

const validateSignup = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
        confirmPassword: joi.string().required()
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
    schema = joi.object().keys({
        email: joi.string().email().required(),
        otp: joi.string().required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateResendOTP = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateLogin = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}


const validateResetPassword = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        oldPassword: joi.string().required(),
        newPassword: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required(),
        confirmPassword: joi.string().required()
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const Admin = {
    validateSignup,
    validateVerifyOTP,
    validateResendOTP,
    validateLogin,
    validateResetPassword
}
export default Admin;