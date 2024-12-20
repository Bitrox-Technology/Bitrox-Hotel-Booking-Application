import UserServices from "../services/user.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { OK } from "../utils/responseCode.js"
import { User } from "../validators/index.js"

const Signup = async (req, res, next) => {
  try {

    if (req.body.email) {
      await User.validateSignupForEmail(req.body)
    } else {
      await User.validateSignupForPhone(req.body)
    }

    let user = await UserServices.signup(req.body)
    return res.status(OK).json(new ApiResponse(OK, user, i18n.__("OTP_SEND_SUCCESS")))
  } catch (error) {
    next(error)
  }

}

const VerifyOTP = async (req, res, next) => {
  try {
    await User.validateVerifyOTP(req.body)
    let user = await UserServices.verifyOTP(req.body)
    return res.status(OK).json(new ApiResponse(OK, user, i18n.__("OTP_VERIFY")))
  } catch (error) {
    next(error)
  }

}


const ResendOTP = async(req, res, next) => {
  try{
     await User.validateResendOTP(req.body);
     let user = await UserServices.resendOTP(req.body)
     return res.status(OK).json(new ApiResponse(OK, user, i18n.__("OTP_RESEND")))
  }catch(error){
    next(error)
  }
}

const UpdateProfile = async(req, res, next) => {
  try{
     await User.validateUpdateProfile(req.body);
     let user = await UserServices.updateProfile(req.body)
     return res.status(OK).json(new ApiResponse(OK, user, i18n.__("PROFILE_UPDATE")))
  }catch(error){
    next(error)
  }
}

const Login = async(req, res, next) => {
  try {
     await User.validateLogin(req.body)
     let user = await UserServices.login(req.body)
     return res.status(OK).json(new ApiResponse(OK, user, i18n.__("USER_LOGIN")))
  } catch (error) {
    next(error)
  }
}

const GetProfile = async(req, res, next)=> {
  try {
    let user = await UserServices.getProfile(req.user)
    return res.status(OK).json(new ApiResponse(OK, user, i18n.__("PROFILE_FETCHED")))
  } catch (error) {
    next(error)
  }
}



const ForgetPassword = async(req, res, next) => {
  try {
     let user = await UserServices.forgetPassword(req.body)
     return res.status(OK).json(new ApiResponse(OK, user, i18n.__("OTP_SEND_SUCCESS")))
  } catch (error) {
    next(error)
  }
}

const Logout = async(req, res, next) => {
  try {
     let user = await UserServices.logout(req.user)
     return res.status(OK).json(new ApiResponse(OK, user, i18n.__("USER_LOGOUT")))
  } catch (error) {
    next(error)
  }
}



const UserControllers = {
  Signup,
  VerifyOTP,
  ResendOTP,
  UpdateProfile,
  Login,
  ForgetPassword,
  GetProfile,
  Logout
}

export default UserControllers
