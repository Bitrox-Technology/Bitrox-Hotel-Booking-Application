import moment from "moment";
import { OTP } from "../models/otp.js";
import Utils from "./utilities.js";
import { sendOtp } from "../services/sendOTP.js";
import { ApiError } from "./apiError.js";
import { BAD_REQUEST } from "./responseCode.js";
import { sendSMSTwilio } from "../services/smsService.js";



const generateOTPForEmail = async(email) => {

    let otpCode = 1234;
    otpCode = Utils.generateOTP();
    try {
        await OTP.deleteMany({email:email});
        let data = {
            email: email,
            otp: otpCode,
            expiredAt: moment().add(10, "minutes").toDate()
        }
        await  sendOtp(email, otpCode)

        let otp = await OTP.create(data)
        return otp
    } catch (error) {
        throw new ApiError(BAD_REQUEST, err)
    }
}

const generateOTPForPhone = async(countaryCode, phone) => {
   
    let otpCode = 1234;
    otpCode = Utils.generateOTP();
    try {
        await OTP.deleteMany({countryCode:countaryCode, phone: phone })
        let data = {
            countryCode:countaryCode, 
            phone: phone,
            otp: otpCode,
            expiredAt: moment().add(10, "minutes").toDate()
        }
        await sendSMSTwilio(countaryCode, phone, otpCode + " is  your hostel booking verification code. ")

        let otp = await OTP.create(data)
        return otp
    } catch (error) {
        throw new ApiError(BAD_REQUEST, err)
    }
}

const verifyEmailOTP = async(email, otp) => {
    return await verifyOtp(null, email, otp)
}

const verifyOtp = async (countryCode, data, otp) => {
    let email, phoneNumber
    if(Utils.isEmail(data)) {
        email = data
    }else {
        phoneNumber = data
    }

    try {
       const storedOTP = await OTP.findOne({
        $or: [
            {email, otp},
            {countryCode, phone: phoneNumber, otp}
        ]
       })

       if (storedOTP) {
        await OTP.deleteOne({
            $or: [
              { email, otp },
              { countryCode, mobileNumber, otp },
            ],
          });

          return true;
       }
    }catch(err){
        return false
    }


}

export {
    generateOTPForEmail,
    generateOTPForPhone,
    verifyEmailOTP,
    verifyOtp
}