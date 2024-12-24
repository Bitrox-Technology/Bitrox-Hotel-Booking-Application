import Host from "../models/host.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateOTPForEmail, generateOTPForPhone, verifyEmailOTP, verifyOtp } from "../utils/functions.js";
import { generateAccessAndRefreshTokenForHost } from "../utils/generateTokens.js";
import { i18n } from "../utils/i18n.js";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../utils/responseCode.js";
import Utils from "../utils/utilities.js";

const signup = async (inputs) => {
    let host;
    if (Utils.comparePasswordAndConfirmpassword(inputs.password, inputs.confirmPassword) == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))
    inputs.password = await Utils.Hashed_Password(inputs.password)
    if (Utils.isEmail(inputs.email)) {
        host = await Host.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        })
        if (!host) {
            host = await Host.findOne({
                email: inputs.email, isDeleted: false
            })
            if (host) {
                await User.deleteMany({
                    email: inputs.email,
                    isDeleted: false,
                    isEmailVerify: false,
                });
            }

            host = await Host.create(inputs);
            await generateOTPForEmail(inputs.email)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("DUPLICATE_EMAIL"))
        }
    } else {
        host = await Host.findOne({
            phone: inputs.phone,
            countryCode: inputs.countryCode,
            isDeleted: false,
            isPhoneVerify: true,
        })
        if (!host) {
            host = await Host.findOne({
                phone: inputs.phone,
                countryCode: inputs.countryCode,
                isDeleted: false,
            });
            if (host) {
                await Host.deleteMany({
                    phone: inputs.phone,
                    countryCode: inputs.countryCode,
                    isDeleted: false,
                    isPhoneVerify: false,
                })
            }

            host = await Host.create(inputs)
            await generateOTPForPhone(inputs.countryCode, inputs.phone)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("DUPLICATE_PHONE"))
        }
    }
}


const verifyOTP = async (inputs) => {
    let host;
    let subObj = {}

    if (Utils.isEmail(inputs.email)) {
        host = await Host.findOne({
            email: inputs.email,
            isDeleted: false
        })

        let otp = await verifyEmailOTP(inputs.email, inputs.otp)

        if (!otp) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_OTP"))
        subObj.isEmailVerify = true
    } else {
        host = await Host.findOne({
            phone: inputs.phone,
            countryCode: inputs.countryCode,
            isDeleted: false,
        })

        if (!host) throw new ApiError(i18n.__("INVALID_PHONE"))

        let otp = await verifyOtp(inputs.countryCode, inputs.phone, inputs.otp)

        if (!otp) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_OTP"))
        subObj.isPhoneVerify = true
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshTokenForHost(host._id)
    subObj.refreshToken = refreshToken
    host = await Host.findByIdAndUpdate({ _id: host._id }, subObj).lean()

    host = await Host.findById({ _id: host._id }).lean()

    host.accessToken = accessToken;
    host.type = "Bearer";
    host.refreshToken = refreshToken;

    return host;
}

const resendOTP = async (inputs) => {
    let host;
    if (Utils.isEmail(inputs.email)) {
        host = await Host.findOne({ email: inputs.email, isDeleted: false })

        if (host) {
            await generateOTPForEmail(inputs.email)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))
        }

    } else {
        host = await Host.findOne({
            phone: inputs.phone,
            countryCode: inputs.countryCode,
            isDeleted: false,
        })
        if (host) {
            await generateOTPForPhone(inputs.countryCode, inputs.phone)
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PHONE"))
        }
    }
    return host;
}


const login = async (inputs) => {
    let host;
    if (Utils.isEmail(inputs.email)) {
        host = await Host.findOne({ email: inputs.email, isDeleted: false, isEmailVerify: true })
    } else {
        host = await Host.findOne({ countryCode: inputs.countryCode, phone: inputs.phone, isDeleted: false, isPhoneVerify: true })
    }

    if (!host) {
        throw new ApiError(BAD_REQUEST, i18n.__("INVALID_USER"))
    } else {
        let compare = await Utils.comparePasswordUsingBcrypt(inputs.password, host.password);
        if (!compare) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))

        const { accessToken, refreshToken } = generateAccessAndRefreshTokenForHost(host._id)
        host = await Host.findByIdAndUpdate({ _id: host._id }, { refreshToken: refreshToken }).lean()
        host = await Host.findById({ _id: host._id }).lean()

        host.accessToken = accessToken;
        host.type = "Bearer";
        host.refreshToken = refreshToken;
    }
    return host;

}

const forgetPassword = async (inputs) => {
    let host;
    if (Utils.isEmail(inputs.email)) {
        host = await Host.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        });
        if (!host) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_EMAIL"))

        await generateOTPForEmail(user.email);
    } else {
        let host = await Host.findOne({
            phone: inputs.phone,
            countryCode: inputs.countryCode,
            isDeleted: false,
            isPhoneVerify: true
        })

        if (!host) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PHONE"))

        await generateOTPForPhone(user.countryCode, user.phone)
    }
}

const getProfile = async (host) => {
    return await Host.findById({ _id: host._id }).lean();
   
}

const logout = async (host) => {
    return await Host.findOneAndUpdate({
        _id: host._id,
        isDeleted: false
    }, {
        $set: { refreshToken: undefined }
    }, {
        new: true
    })
}

const resetPassword = async(inputs, id) => {
    let host;
    if (Utils.comparePasswordAndConfirmpassword(inputs.newPassword, inputs.confirmPassword) == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))

    host = await Host.findById({id: id._id}).lean()

    let match = await Utils.comparePasswordUsingBcrypt(inputs.oldPassword, host.password)

    if(!match) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))

    let password = await Utils.Hashed_Password(inputs.password)

    await Host.findOneAndUpdate({id: id._id}, {$set: {password: password}}, {new: true})

    host = await Host.findById({_id: id._id}).lean()

    return host;

}


const profileSetup = async(inputs, id, files) => {
    let host, frontImageUrl, backImageUrl, avatarUrl
    const { frontImage, backImage, avatar} = files
    host = await Host.findById(id._id).lean()
    if (!host) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_HOST"))
    if (frontImage && backImage && avatar){
        frontImageUrl = await uploadOnCloudinary(frontImage[0].path)
        backImageUrl = await uploadOnCloudinary(backImage[0].path)
        avatarUrl = await uploadOnCloudinary(backImage[0].path)
    }

    if (!frontImageUrl && !backImageUrl && !avatar) throw new ApiError(INTERNAL_SERVER_ERROR, "SERVER_ERROR")
    
    let documents = {
        name: inputs.documents[0].name,
        frontImage: frontImageUrl.url,
        backImage: backImageUrl.url ,
    }
    host = await Host.findByIdAndUpdate({ _id: host._id}, {
        firstName: firstName || inputs.firstName,
        lastName: lastName || inputs.lastName,
        phone: phone || inputs.phone,
        email: email || inputs.email,
        address: address || inputs.address,
        bankDetails: bankDetails || inputs.bankDetails,
        avatar: avatar || avatarUrl.url
    })
    


   







}

const HostServices = {
    signup,
    verifyOTP,
    resendOTP,
    login,
    getProfile,
    forgetPassword,
    logout,
    resetPassword,
    profileSetup
    
}
export default HostServices