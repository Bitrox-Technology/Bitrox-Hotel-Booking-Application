import Host from "../models/host.js";
import Property from "../models/property.js";
import { ApiError } from "../utils/apiError.js";
import { uploadMutliImageOnCloudinary } from "../utils/cloudinary.js";
import { generateOTPForEmail, generateOTPForPhone, verifyEmailOTP, verifyOtp } from "../utils/functions.js";
import { generateAccessAndRefreshTokenForHost } from "../utils/generateTokens.js";
import { i18n } from "../utils/i18n.js";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../utils/responseCode.js";
import Utils from "../utils/utilities.js";

const signup = async (inputs) => {
    let host;
    if (Utils.isEmail(inputs.email)) {
        let compare = Utils.comparePasswordAndConfirmpassword(inputs.password, inputs.confirmPassword)
        if (compare == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))
        inputs.password = await Utils.Hashed_Password(inputs.password)
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
                await Host.deleteMany({
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
        if (!host) throw new ApiError(i18n.__("INVALID_EMAIL"))
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForHost(host._id)
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
}


const login = async (inputs) => {
    let host;
    if (Utils.isEmail(inputs.email)) {
        host = await Host.findOne({ email: inputs.email, isDeleted: false, isEmailVerify: true }).select("+password")
        if (!host) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_HOST"))

        let compare = await Utils.comparePasswordUsingBcrypt(inputs.password, host.password);
        if (!compare) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForHost(host._id)
        host = await Host.findByIdAndUpdate({ _id: host._id }, { refreshToken: refreshToken }).lean()
        host = await Host.findById({ _id: host._id }).lean()

        host.accessToken = accessToken;
        host.type = "Bearer";
        host.refreshToken = refreshToken;
        return host
    } else {
        host = await Host.findOne({ countryCode: inputs.countryCode, phone: inputs.phone, isDeleted: false, isPhoneVerify: true })
        if (!host) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_HOST"))
        await generateOTPForPhone(inputs.countryCode, inputs.phone)
    }

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

        let compare = Utils.comparePasswordAndConfirmpassword(inputs.newPassword, inputs.confirmPassword)
        if (compare == false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))
        inputs.newPassword = await Utils.Hashed_Password(inputs.newPassword)

        host = await Host.findByIdAndUpdate({ _id: host._id }, { password: inputs.newPassword })

        await generateOTPForEmail(host.email);
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
        $set: { refreshToken: "" }
    }, {
        new: true
    }).select("+refreshToken")
}

const resetPassword = async (inputs, id) => {
    let host;
    let compare = Utils.comparePasswordAndConfirmpassword(inputs.newPassword, inputs.confirmPassword)
    if (compare === false) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_CREDENTIALS"))

    host = await Host.findById({ _id: id._id }).select("+password")

    let match = await Utils.comparePasswordUsingBcrypt(inputs.oldPassword, host.password)

    if (!match) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_PASSWORD"))

    let password = await Utils.Hashed_Password(inputs.newPassword)

    await Host.findOneAndUpdate({ _id: id._id }, { $set: { password: password } }, { new: true })

    host = await Host.findById({ _id: id._id }).lean()

    return host;

}

const profileSetup = async (inputs, id, files) => {
    // Extract files
    const frontImages = files['frontImage'] || [];
    const backImages = files['backImage'] || [];
    const avatar = files['avatar'] ? files['avatar'][0] : null; // Expecting only one avatar file

    // Validate document counts
    if (
        !inputs.documents ||
        frontImages.length !== backImages.length ||
        frontImages.length !== inputs.documents.length
    ) {
        throw new ApiError(BAD_REQUEST, i18n.__("INVALID_DATA"));
    }

    // Upload avatar
    let uploadAvatar;
    if (avatar) {
        uploadAvatar = await uploadMutliImageOnCloudinary(avatar.path, {
            resource_type: "image",
            folder: "host_avatars",
        });
        if (!uploadAvatar) {
            throw new ApiError(INTERNAL_SERVER_ERROR, "Avatar upload failed");
        }
    }

    // Upload documents
    const uploadDocuments = await Promise.all(
        inputs.documents.map(async (doc, index) => {
            const frontImageUpload = await uploadMutliImageOnCloudinary(frontImages[index].path, {
                resource_type: "image",
                folder: "host_documents",
            });

            const backImageUpload = await uploadMutliImageOnCloudinary(backImages[index].path, {
                resource_type: "image",
                folder: "host_documents",
            });

            if (!frontImageUpload || !backImageUpload) {
                throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("FAILED_UPLOAD"));
            }

            return {
                name: doc.name,
                frontImage: frontImageUpload.secure_url,
                backImage: backImageUpload.secure_url,
                expiryDate: doc.expiryDate ? new Date(doc.expiryDate) : null,
            };
        })
    );

    // Prepare host data
    const hostData = {
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        countryCode: inputs.countryCode,
        phone: inputs.phone,
        avatar: uploadAvatar?.secure_url,
        address: inputs.address,
        bankDetails: inputs.bankDetails,
        documents: uploadDocuments,
    };

    // Update host in the database
    const host = await Host.findByIdAndUpdate({ _id: id._id }, hostData, { new: true }).lean();

    return host;
};


const addProperty = async (inputs, id, files) => {
    let host
    let images = files['images'] || [];
    if (!images) throw new ApiError(BAD_REQUEST, i18n.__("INVALID_DATA"))

    let uploadImages = await Promise.all(
        images.map(async (image) => {
            let imagesUpload = await uploadMutliImageOnCloudinary(image.path, {
                resource_type: "image",
                folder: "host_property",
            });

            if (!imagesUpload ) {
                throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("FAILED_UPLOAD"));
            }

            return imagesUpload.secure_url
        })
    );

    let propertyData = {
        hostId: id._id,
        title: inputs.title,
        description: inputs.description,
        propertyType: inputs.propertyType,
        images: uploadImages,
        location: inputs.location,
        amenities: inputs.amenities,
        pricing: inputs.pricing,
        status: inputs.status || "Available"
    }

    host = await Property.create(propertyData)

    return host
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
    profileSetup,
    addProperty

}
export default HostServices