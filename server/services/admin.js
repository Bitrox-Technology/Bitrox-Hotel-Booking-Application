import Admin from "../models/admin.js";
import { generateAccessAndRefreshTokenForAdmin } from "../utils/generateTokens.js";
import { i18n } from "../utils/i18n.js";
import { BAD_REQUEST } from "../utils/responseCode.js";
import Utils from "../utils/utilities.js";
import { ApiError } from "../utils/apiError.js";
import { generateOTPForEmail, verifyEmailOTP } from "../utils/functions.js";


const signup = async (inputs) => {
    let admin;
    if (Utils.isEmail(inputs.email)) {
        let compare = Utils.comparePasswordAndConfirmpassword(inputs.password, inputs.confirmPassword)
        if (compare == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))
        inputs.password = await Utils.Hashed_Password(inputs.password)
        admin = await Admin.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        })
        if (!admin) {
            admin = await Admin.findOne({
                email: inputs.email, isDeleted: false
            })
            if (admin) {
                await Admin.deleteMany({
                    email: inputs.email,
                    isDeleted: false,
                    isEmailVerify: false,
                });
            }

            admin = await Admin.create(inputs);
            await generateOTPForEmail(inputs.email)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("DUPLICATE_EMAIL"))
        }
    }
}

const verifyOTP = async (inputs) => {
    let admin;
    let subObj = {}

    if (Utils.isEmail(inputs.email)) {
        admin = await Admin.findOne({
            email: inputs.email,
            isDeleted: false
        })
        if (!admin) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_ADMIN"))
        let otp = await verifyEmailOTP(inputs.email, inputs.otp)

        if (!otp) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_OTP"))
        subObj.isEmailVerify = true
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForAdmin(admin._id)
    subObj.refreshToken = refreshToken
    admin = await Admin.findByIdAndUpdate({ _id: admin._id }, subObj).lean()

    admin = await Admin.findById({ _id: admin._id }).lean()

    admin.accessToken = accessToken;
    admin.type = "Bearer";
    admin.refreshToken = refreshToken;

    return admin;
}


const resendOTP = async (inputs) => {
    let admin;
    if (Utils.isEmail(inputs.email)) {
        admin = await Admin.findOne({ email: inputs.email, isDeleted: false })

        if (admin) {
            await generateOTPForEmail(inputs.email)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))
        }
    }
}

const login = async (inputs) => {
    let admin;
    if (Utils.isEmail(inputs.email)) {
        admin = await Admin.findOne({ email: inputs.email, isDeleted: false, isEmailVerify: true }).select("+password")
        if (!admin) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_ADMIN"))

        let compare = await Utils.comparePasswordUsingBcrypt(inputs.password, admin.password);
        if (!compare) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForAdmin(admin._id)
        admin = await Admin.findByIdAndUpdate({ _id: admin._id }, { refreshToken: refreshToken }).lean()
        admin = await Admin.findById({ _id: admin._id }).lean()

        admin.accessToken = accessToken;
        admin.type = "Bearer";
        admin.refreshToken = refreshToken;

        return admin;
    }
}

const getProfile = async (admin) => {
    return Admin.findById({ _id: admin._id }).lean()
}

const forgetPassword = async (inputs) => {
    let admin;
    if (Utils.isEmail(inputs.email)) {
        admin = await Admin.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        });
        if (!admin) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))

        let compare = Utils.comparePasswordAndConfirmpassword(inputs.newPassword, inputs.confirmPassword)
        if (compare == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))
        inputs.newPassword = await Utils.Hashed_Password(inputs.newPassword)

        admin = await Admin.findByIdAndUpdate({ _id: admin._id }, { password: inputs.newPassword })

        await generateOTPForEmail(admin.email);
    }
}

const logout = async (user) => {
    return await Admin.findOneAndUpdate({
        _id: user._id,
        isDeleted: false
    }, {
        $set: { refreshToken: "" }
    }, {
        new: true
    }).select("+refreshToken")
}

const resetPassword = async (inputs, id) => {
    let admin;
    let compare = Utils.comparePasswordAndConfirmpassword(inputs.newPassword, inputs.confirmPassword)
    if (compare === false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))

    admin = await Admin.findById({ _id: id._id }).select("+password")

    let match = await Utils.comparePasswordUsingBcrypt(inputs.oldPassword, admin.password)

    if (!match) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))

    let password = await Utils.Hashed_Password(inputs.newPassword)

    await Admin.findOneAndUpdate({ _id: id._id }, { $set: { password: password } }, { new: true })

    admin = await Admin.findById({ _id: id._id }).lean()

    return admin;

}


const AdminServices = {
    signup,
    verifyOTP,
    resendOTP,
    login,
    getProfile,
    forgetPassword,
    logout,
    resetPassword
}
export default AdminServices
