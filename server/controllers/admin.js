import AdminServices from "../services/admin.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { i18n } from "../utils/i18n.js"
import { OK } from "../utils/responseCode.js"
import { Admin } from "../validators/index.js"

const Signup = async (req, res, next) => {
    try {
        await Admin.validateSignup(req.body)
        const admin = await AdminServices.signup(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("OTP_SEND_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const VerifyOTP = async (req, res, next) => {
    try {
        await Admin.validateVerifyOTP(req.body)
        const admin = await AdminServices.verifyOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("OTP_VERIFY")))
    } catch (error) {
        next(error)
    }
}

const ResendOTP = async (req, res, next) => {
    try {
        await Admin.validateResendOTP(req.body);
        let admin = await AdminServices.resendOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("OTP_RESEND")))
    } catch (error) {
        next(error)
    }
}

const Login = async (req, res, next) => {
    try {
        await Admin.validateLogin(req.body);
        let admin = await AdminServices.login(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("ADMIN_LOGIN")))
    } catch (error) {
        next(error)
    }
}

const GetProfile = async (req, res, next) => {
    try {
        let admin = await AdminServices.getProfile(req.user)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("PROFILE_FETCHED")))
    } catch (error) {
        next(error)
    }
}

const ForgetPassword = async (req, res, next) => {
    try {
        let admin = await AdminServices.forgetPassword(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("OTP_SEND_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const Logout = async (req, res, next) => {
    try {
        let admin = await AdminServices.logout(req.user)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("ADMIN_LOGOUT")))
    } catch (error) {
        next(error)
    }
}

const ResetPassword = async (req, res, next) => {
    try {
        await Admin.validateResetPassword(req.body)
        let admin = await AdminServices.resetPassword(req.body, req.user)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("RESET_PASSWORD")))
    } catch (error) {
        next(error)
    }
}



const AdminControllers = {
    Signup,
    VerifyOTP,
    ResendOTP,
    Login,
    GetProfile,
    ForgetPassword,
    Logout,
    ResetPassword
}

export default AdminControllers