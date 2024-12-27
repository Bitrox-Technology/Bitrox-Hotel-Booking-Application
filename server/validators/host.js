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

const validateProfileSetup = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
       firstName: joi.string().min(3).max(50).optional(),
       lastName: joi.string().optional(),
       email: joi.string().email().optional(),
       countryCode: joi.string().optional(),
       phone: joi.string().pattern(/^[0-9\-\(\)\s]+$/).optional(),
       avatar: joi.string().uri().optional(),
       address: joi.object({
           line1: joi.string().trim().optional(),
           line2: joi.string().trim().optional(),
           city: joi.string().trim().optional(),
           state: joi.string().trim().optional(),
           country: joi.string().trim().optional(),
           zipCode: joi.string()
               .trim()
               .pattern(/^[0-9]{5,6}$/) // Example pattern for ZIP codes
               .optional(),
       }).optional(),
       bankDetails: joi.object({
           bankName: joi.string().trim().optional(),
           accountHolderName: joi.string().trim().optional(),
           branchName: joi.string().trim().optional(),
           bankCode: joi.string().trim().optional(),
       }).optional(),
       documents: joi.array()
           .items(
               joi.object({
                   name: joi.string().trim().optional(),
                   frontImage: joi.string().uri().optional(),
                   backImage: joi.string().uri().optional(),
                   expiryDate: joi.date().optional(),
               })
           ).optional(),
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

const validateProperty = async (inputs) => {
    let schema = {}
    schema = joi.object().keys({
        title: joi.string().required(),
        description: joi.string().required(),
        propertyType: joi.string().valid("Beach", "Hotel", "Villa", "Appartment").required(),
        images: joi.array().items(joi.string().uri()),
        location: joi.object({
            address: joi.object({
                line1: joi.string().required(),
                line2: joi.string().required(),
                city: joi.string().required(),
                state: joi.string().required(),
                country: joi.string().required(),
                zipCode: joi.string().required(),
            }).required(),
            mapCoordinates: joi.object({
                type: joi.string().valid("Point").required(),
                coordinates: joi.array().items(joi.number().required()).length(2).required(),
            }).required()
        }).required(),
        amenities: joi.object({
            kitchen: joi.boolean().required(),
            wifi: joi.boolean().required(),
            parking: joi.boolean().required(),
            accessibility: joi.boolean().required(),
        }).required(),

        pricing: joi.object({
            pricePerNight: joi.number().min(0).required(),
            weeklyDiscount: joi.number().min(0).allow(0),
        }).required(),
        status: joi.string().valid("Available", "Unavailable").default("Available")
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('INVALID_CREDENTIALS');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}






const Host= {
    validateSignup,
    validateVerifyOTP,
    validateResendOTP,
    validateLogin,
    validateProfileSetup,
    validateResetPassword,
    validateforgetPassword,
    validateProperty
}
export default Host;
    
