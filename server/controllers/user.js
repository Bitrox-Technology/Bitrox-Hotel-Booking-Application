import Services from "../services/index.js"
import { User } from "../validators/index.js"

const Signup = async (req, res, next) => {
  try {

    if (req.body.email) {
      await User.validateSignupForEmail(req.body)
    } else {
      await User.validateSignupForPhone(req.body)
    }

    let user = await Services.signup(req.body)
    return res.status(OK).json(new ApiResponse(OK, user, i18n.__("OTP_SEND_SUCCESS")))
  } catch (error) {
    next(error)
  }

}

const VerifyOTP = async (req, res, next) => {
  try {
    await User.validateVerifyOTP(req.body)
    let user = await Services.verifyOTP(req.body)
    return res.status(OK).json(new ApiResponse(OK, user, i18n.__("OTP_SEND_SUCCESS")))
  } catch (error) {
    next(error)
  }

}


const UserControllers = {
  Signup,
  VerifyOTP
}

export default UserControllers
