import { UserServices } from "../services/index.js"
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



const UserControllers = {
  Signup,
  VerifyOTP,
  ResendOTP
}

export default UserControllers
