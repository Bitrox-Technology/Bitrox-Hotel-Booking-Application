import User from "../models/user.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateOTPForEmail, generateOTPForPhone, verifyEmailOTP, verifyOtp } from "../utils/functions.js";
import { generateAccessAndRefreshTokenForUser } from "../utils/generateTokens.js";
import { i18n } from "../utils/i18n.js";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../utils/responseCode.js";
import Utils from "../utils/utilities.js";

const signup = async (inputs) => {
    let user;
    if (Utils.isEmail(inputs.email)) {
        let compare = Utils.comparePasswordAndConfirmpassword(inputs.password, inputs.confirmPassword)
        if (compare == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))
        inputs.password = await Utils.Hashed_Password(inputs.password)
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
        if (!user) throw new ApiError(i18n.__("INVALID_EMAIL"))
        let otp = await verifyEmailOTP(inputs.email, inputs.otp)

        if (otp === false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_OTP"))
        subObj.isEmailVerify = true
    } else {
        user = await User.findOne({
            phone: inputs.phone,
            countryCode: inputs.countryCode,
            isDeleted: false,
        })

        if (!user) throw new ApiError(i18n.__("INVALID_PHONE"))

        let otp = await verifyOtp(inputs.countryCode, inputs.phone, inputs.otp)

        if (otp === false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_OTP"))
        subObj.isPhoneVerify = true
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForUser(user._id)
    subObj.refreshToken = refreshToken
    user = await User.findByIdAndUpdate({ _id: user._id }, subObj).lean()

    user = await User.findById({ _id: user._id }).lean()

    user.accessToken = accessToken;
    user.type = "Bearer";
    user.refreshToken = refreshToken;

    return user;
}

const resendOTP = async (inputs) => {
    let user;
    if (Utils.isEmail(inputs.email)) {
        user = await User.findOne({ email: inputs.email, isDeleted: false })

        if (user) {
            await generateOTPForEmail(inputs.email)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))
        }

    } else {
        user = await User.findOne({
            phone: inputs.phone,
            countryCode: inputs.countryCode,
            isDeleted: false,
        })
        if (user) {
            await generateOTPForPhone(inputs.countryCode, inputs.phone)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PHONE"))
        }
    }
}


const login = async (inputs) => {
    let user;
    if (Utils.isEmail(inputs.email)) {
        user = await User.findOne({ email: inputs.email, isDeleted: false, isEmailVerify: true }).select("+password")
        if (!user) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_USER"))
        let compare = await Utils.comparePasswordUsingBcrypt(inputs.password, user.password);
        if (!compare) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForUser(user._id)
        user = await User.findByIdAndUpdate({ _id: user._id }, { refreshToken: refreshToken }).lean()
        user = await User.findById({ _id: user._id }).lean()

        user.accessToken = accessToken;
        user.type = "Bearer";
        user.refreshToken = refreshToken;
        return user

    } else {
        user = await User.findOne({ countryCode: inputs.countryCode, phone: inputs.phone, isDeleted: false, isPhoneVerify: true })
        if (!user) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_USER"))
        await generateOTPForPhone(inputs.countryCode, inputs.phone)
    }
}

const forgetPassword = async (inputs) => {
    let user;
    if (Utils.isEmail(inputs.email)) {

        user = await User.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        });
        if (!user) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))

        let compare = Utils.comparePasswordAndConfirmpassword(inputs.newPassword, inputs.confirmPassword)
        if (compare == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))
        inputs.newPassword = await Utils.Hashed_Password(inputs.newPassword)

        user = await User.findByIdAndUpdate({ _id: user._id }, { password: inputs.newPassword })

        await generateOTPForEmail(user.email);
    }
}

const getProfile = async (user) => {
    return await User.findById({ _id: user._id }).lean();

}

const logout = async (user) => {
    return await User.findByIdAndUpdate({
        _id: user._id,
        isDeleted: false
    }, {
        $set: { refreshToken: "" }
    }, {
        new: true
    }).select("+refreshToken")

}

const resetPassword = async (inputs, id) => {
    let user;
    let compare = Utils.comparePasswordAndConfirmpassword(inputs.newPassword, inputs.confirmPassword)
    if (compare === false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))

    user = await User.findById({ _id: id._id }).select("+password")

    let match = await Utils.comparePasswordUsingBcrypt(inputs.oldPassword, user.password)

    if (!match) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))

    let password = await Utils.Hashed_Password(inputs.newPassword)

    await User.findOneAndUpdate({ _id: id._id }, { $set: { password: password } }, { new: true })

    user = await User.findById({ _id: id._id }).lean()

    return user;

}


const updateProfile = async (inputs, id, files) => {
    let user;
    let avatar = files
    if (!avatar) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_AVATAR"))

    let upload = await uploadOnCloudinary(avatar.path)
    if (!upload) throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("SERVER_ERROR"))

    inputs.avatar = upload.url
    user = await User.findByIdAndUpdate({ _id: id._id }, inputs)

    user = await User.findById({ _id: user._id }).lean()

    return user;

}

const UserServices = {
    signup,
    verifyOTP,
    resendOTP,
    login,
    getProfile,
    forgetPassword,
    logout,
    resetPassword,
    updateProfile

}
export default UserServices