import { User } from "../models/user.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateOTPForEmail, generateOTPForPhone, verifyEmailOTP, verifyOtp } from "../utils/functions.js";
import { generateAccessAndRefreshTokenForUser } from "../utils/generateTokens.js";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../utils/responseCode.js";
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

    const { accessToken, refreshToken } = generateAccessAndRefreshTokenForUser(user._id)
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
    return user;
}

const updateProfile = async (inputs, user) => {
    let user;
    user = await User.findById({ _id: user._id }).lean()

    if (!user) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_USER"))

    console.log("Avatar: ", req.file)
    let avatar = req.file
    if (!avatar) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_AVATAR"))

    let upload = await uploadOnCloudinary(avatar.path)
    if (!upload) throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("SERVER_ERROR"))


    user = await User.findByIdAndUpdate({ _id: user._id }, inputs, { avatar: upload.url, isProfileComplete: true, profileCompleteAt: Date.now() }).lean()

    user = await User.findById({ _id: user._id }).lean()

    return user;

}

const login = async (inputs) => {
    let user;
    if (Utils.isEmail(inputs.email)) {
        user = await User.findOne({ email: inputs.email, isDeleted: false, isEmailVerify: true })
    } else {
        user = await User.findOne({ countryCode: inputs.countryCode, phone: inputs.phone, isDeleted: false, isPhoneVerify: true })
    }

    if (!user) {
        throw new ApiError(BAD_REQUEST, i18n.__("INVALID_USER"))
    } else {
        let compare = await Utils.comparePasswordUsingBcrypt(inputs.password, user.password);
        if (!compare) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))

        const { accessToken, refreshToken } = generateAccessAndRefreshTokenForUser(user._id)
        user = await User.findByIdAndUpdate({ _id: user._id }, { refreshToken: refreshToken }).lean()
        user = await User.findById({ _id: user._id }).lean()

        user.accessToken = accessToken;
        user.type = "Bearer";
        user.refreshToken = refreshToken;
    }
    return user;

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

        await generateOTPForEmail(user.email);
    } else {
        let user = await User.findOne({
            phone: inputs.phone,
            countryCode: inputs.countryCode,
            isDeleted: false,
            isPhoneVerify: true
        })

        if (!user) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PHONE"))

        await generateOTPForPhone(user.countryCode, user.phone)
    }
}

const getProfile = async (user) => {
    return await User.findById({ _id: user._id }).lean();
   
}

const logout = async (user) => {
    return await User.findOneAndUpdate({
        _id: user._id,
        isDeleted: false
    }, {
        $set: { refreshToken: undefined }
    }, {
        new: true
    })
}

const resetPassword = async(inputs, id) => {
    let user;
    if (Utils.comparePasswordAndConfirmpassword(inputs.newPassword, inputs.confirmPassword) == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))

    user = await User.findById({id: id._id}).lean()

    let match = await Utils.comparePasswordUsingBcrypt(inputs.oldPassword, user.password)

    if(!match) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))

    let password = await Utils.Hashed_Password(inputs.password)

    await User.findOneAndUpdate({id: id._id}, {$set: {password: password}}, {new: true})

    user = await User.findById({_id: id._id}).lean()

    return user;

}


const UserServices = {
    signup,
    verifyOTP,
    resendOTP,
    updateProfile,
    login,
    getProfile,
    forgetPassword,
    logout,
    resetPassword
    

}
export default UserServices