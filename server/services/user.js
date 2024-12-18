import { User } from "../models/user.js";
import { ApiError } from "../utils/apiError.js";
import { generateOTPForEmail, generateOTPForPhone, verifyEmailOTP, verifyOtp } from "../utils/functions.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";
import { BAD_REQUEST } from "../utils/responseCode.js";
import Utils from "../utils/utilities.js";

const signup = async (inputs) => {
    let user;
    if (Utils.comparePasswordAndConfirmpassword(inputs.password, inputs.confirmPassword) == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))
    inputs.password = await Utils.Hashed_Password(inputs.password)

    if (Utils.isEmail(inputs.email)) {
        user = await User.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        })
        if (!user) {
            user = await User.findOne({
                email: inputs.email, isDeleted: false
            })
            if (user) {
                await User.deleteMany({
                    email: inputs.email,
                    isDeleted: false,
                    isEmailVerify: false,
                });
            }

            user = await User.create(inputs);
            await generateOTPForEmail(inputs.email)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("DUPLICATE_EMAIL"))
        }
    } else {
        user = await User.findOne({
            phone: inputs.phone,
            countryCode: inputs.countryCode,
            isDeleted: false,
            isPhoneVerify: true,
        })
        if (!user) {
            user = await User.findOne({
                phone: inputs.phone,
                countryCode: inputs.countryCode,
                isDeleted: false,
            });
            if (user) {
                await User.deleteMany({
                    phone: inputs.phone,
                    countryCode: inputs.countryCode,
                    isDeleted: false,
                    isPhoneVerify: false,
                })
            }

            user = await User.create(inputs)
            await generateOTPForPhone(inputs.countryCode, inputs.phone)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("DUPLICATE_PHONE"))
        }
    }
}


const verifyOTP = async (inputs) => {
    let user;
    let subObj = {}

    if (Utils.isEmail(inputs.email)) {
        user = await User.findOne({
            email: inputs.email,
            isDeleted: false
        })

        let otp = await verifyEmailOTP(inputs.email, inputs.otp)

        if (!otp) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_OTP"))
        subObj.isEmailVerify = true
    } else {
        user = await User.findOne({
            phone: inputs.phone,
            countryCode: inputs.countryCode,
            isDeleted: false,
        })

        if (!user) throw new ApiError(i18n.__("INVALID_PHONE"))

        let otp = await verifyOtp(inputs.countryCode, inputs.phone, inputs.otp)

        if (!otp) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_OTP"))
        subObj.isPhoneVerify = true
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshToken(user._id)
    subObj.refreshToken = refreshToken
    user = await User.findByIdAndUpdate({_id: user._id}, subObj).lean()

    user = await User.findById({_id: user._id}).lean()

    user.accessToken = accessToken;
    user.type = "Bearer";
    user.refreshToken = refreshToken;

    return user


}

export {
    signup,
    verifyOTP
}