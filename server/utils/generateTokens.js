import { INTERNAL_SERVER_ERROR } from "./responseCode.js";
import { ApiError } from "./apiError.js";
import { i18n } from "./i18n.js";

import User from "../models/user.js";
import Utils from "./utilities.js";
import Admin from "../models/admin.js";

const generateAccessAndRefreshTokenForUser = async (user) => {
    try {
        const existeduser = await User.findById(user._id)
        const accessToken = await Utils.generateAccessToken(user, "USER")
        const refreshToken = await Utils.generateRefershToken(user)
    
        existeduser.refreshToken = refreshToken;
        await existeduser.save({ validateBeforeSave: false })
        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("SERVER_ERROR"))
    }
}


const generateAccessAndRefreshTokenForAdmin = async (admin) => {
    try {
        const existedadmin = await Admin.findById(admin._id)
        const accessToken = await Utils.generateAccessToken(admin, "ADMIN")
        const refreshToken = await Utils.generateRefershToken(admin)
    
        existedadmin.refreshToken = refreshToken;
        await existedadmin.save({ validateBeforeSave: false })
        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("SERVER_ERROR"))
    }
}

export { generateAccessAndRefreshTokenForUser, generateAccessAndRefreshTokenForAdmin }