import HostServices from "../services/host.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { OK } from "../utils/responseCode.js"
import { Host } from "../validators/index.js"

const Signup = async (req, res, next) => {
  try {
    await Host.validateSignup(req.body)
    let host = await HostServices.signup(req.body)
    return res.status(OK).json(new ApiResponse(OK, host, i18n.__("OTP_SEND_SUCCESS")))
  } catch (error) {
    next(error)
  }

}

const VerifyOTP = async (req, res, next) => {
  try {
    await Host.validateVerifyOTP(req.body)
    let host = await HostServices.verifyOTP(req.body)
    return res.status(OK).json(new ApiResponse(OK, host, i18n.__("OTP_VERIFY")))
  } catch (error) {
    next(error)
  }

}


const ResendOTP = async(req, res, next) => {
  try{
     await Host.validateResendOTP(req.body);
     let host = await HostServices.resendOTP(req.body)
     return res.status(OK).json(new ApiResponse(OK, host, i18n.__("OTP_RESEND")))
  }catch(error){
    next(error)
  }
}


const Login = async(req, res, next) => {
  try {
     await Host.validateLogin(req.body)
     let host = await HostServices.login(req.body)
     return res.status(OK).json(new ApiResponse(OK, host, i18n.__("HOST_LOGIN")))
  } catch (error) {
    next(error)
  }
}

const GetProfile = async(req, res, next)=> {
  try {
    let host = await HostServices.getProfile(req.user)
    return res.status(OK).json(new ApiResponse(OK, host, i18n.__("PROFILE_FETCHED")))
  } catch (error) {
    next(error)
  }
}



const ForgetPassword = async(req, res, next) => {
  try {
     let host = await HostServices.forgetPassword(req.body)
     return res.status(OK).json(new ApiResponse(OK, host, i18n.__("OTP_SEND_SUCCESS")))
  } catch (error) {
    next(error)
  }
}

const Logout = async(req, res, next) => {
  try {
     let host = await HostServices.logout(req.user)
     return res.status(OK).json(new ApiResponse(OK, host, i18n.__("HOST_LOGOUT")))
  } catch (error) {
    next(error)
  }
}


const ResetPassword = async(req, res, next) => {
  try {
     await Host.validateResetPassword(req.body)
     let host = await HostServices.resetPassword(req.body, req.user)
     return res.status(OK).json(new ApiResponse(OK, host, i18n.__("RESET_PASSWORD")))
  } catch (error) {
    next(error)
  }
}


const ProfileSetup = async(req, res, next)=> {
    try {
        await Host.validateProfileSetup(req.body)
        let host = await HostServices.profileSetup(req.body, req.user, req.files)
        return res.status(OK).json(new ApiResponse(OK, host, i18n.__("PROFILE_SETUP")))
     } catch (error) {
       next(error)
     }
}

const AddProperty = async(req, res, next)=> {
    try {
        await Host.validateProperty(req.body)
        let host = await HostServices.profileSetup(req.body, req.user, req.files)
        return res.status(OK).json(new ApiResponse(OK, host, i18n.__("PROFILE_SETUP")))
     } catch (error) {
       next(error)
     }
}




const HostControllers = {
  Signup,
  VerifyOTP,
  ResendOTP,
  Login,
  ForgetPassword,
  GetProfile,
  Logout,
  ResetPassword,
  ProfileSetup
}

export default HostControllers