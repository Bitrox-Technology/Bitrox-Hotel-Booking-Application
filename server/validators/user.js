import { ApiError } from "../utils/apiError.js";
import {BAD_REQUEST} from "../utils/responseCode.js"
import { i18n } from "../utils/i18n.js";
import joi from "joi"

const validateSignup = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        email: joi.string().email().optional(),
        countryCode: joi.string().optional(),
        phone: joi.string().pattern(/^[0-9\-\(\)\s]+$/).optional(),
        password: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).optional(),
        confirmPassword: joi.string().optional()
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
       email: joi.string().email().optional(),
       otp: joi.string().required(),
       countryCode: joi.string().optional(),
       phone: joi.string().pattern(/^[0-9\-\(\)\s]+$/).optional()

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
       email: joi.string().email().optional(),
       countryCode: joi.string().optional(),
       phone: joi.string().pattern(/^[0-9\-\(\)\s]+$/).optional()

    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateforgetPassword = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
       email: joi.string().email().optional(),
       countryCode: joi.string().optional(),
       phone: joi.string().pattern(/^[0-9\-\(\)\s]+$/).optional(),
       newPassword: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).optional(),
       confirmPassword: joi.string().optional(),
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
       email: joi.string().email().allow("", null).optional(),
       countryCode: joi.string().allow("", null).optional(),
       phone: joi.string().pattern(/^[0-9\-\(\)\s]+$/).optional(),
       password: joi.string().min(6).pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).optional(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateUpdateProfile = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
       firstName: joi.string().min(3).max(50).optional(),
       lastName: joi.string().min(3).max(50).optional(),
       email: joi.string().email().optional(),
       countryCode: joi.string().optional(),
       phone: joi.string().pattern(/^[0-9\-\(\)\s]+$/).optional(),
       avatar: joi.string().optional(),
       location: joi.string().optional(),

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



const User= {
    validateSignup,
    validateVerifyOTP,
    validateResendOTP,
    validateLogin,
    validateUpdateProfile,
    validateResetPassword,
    validateforgetPassword
}
export default User;
    
