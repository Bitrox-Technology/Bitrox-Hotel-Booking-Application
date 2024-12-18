import { INTERNAL_SERVER_ERROR } from "./responseCode.js";
import { ApiError } from "./apiError.js";
import { i18n } from "./i18n.js";

import { User } from "../models/user.js";
import Utils from "./utilities.js";

const generateAccessAndRefreshToken = async (user) => {
    try {
        const existeduser = await User.findById(user._id)
        const accessToken = await Utils.generateAccessToken(user)
        const refreshToken = await Utils.generateRefershToken(user)
    
        existeduser.refreshToken = refreshToken;
        await existeduser.save({ validateBeforeSave: false })
        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("SERVER_ERROR"))
    }
}

export { generateAccessAndRefreshToken }