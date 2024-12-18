import twilio from "twilio"  
import { ApiError } from "../utils/apiError.js";
import { BAD_REQUEST } from "../utils/responseCode.js";

const sendSMSTwilio = async(countryCode, phone, message) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const twilioClient = twilio(accountSid, authToken, {lazyLoading: true, });

    const smsOptions = {
        from: process.env.TWILIO_PHONE_NUMBER,
        to: (countryCode ? countryCode : "") + (phone ? phone.toString(): ""), body: null,
    }

    smsOptions.body = message;
    try {
        await twilioClient.messages.create(smsOptions)
    } catch (error) {
        throw new ApiError(BAD_REQUEST, error)
    }
}

export {
    sendSMSTwilio
}