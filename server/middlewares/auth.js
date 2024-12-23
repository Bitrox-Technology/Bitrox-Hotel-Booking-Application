import { User } from "../models/index.js";
import { ApiError } from "../utils/apiErrors.js"
import { BAD_REQUEST, UN_AUTHORIZED } from "../utils/responseCode.js";
import { i18n } from "../utils/i18n.js";
import jwt from "jsonwebtoken"

const AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(UN_AUTHORIZED, i18n.__("INVALID_REQUEST"))
        }

        const decordedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let user;

        if(decordedToken?.role == "ADMIN"){
           user = await Admin.findById(decordedToken?._id).lean()
        }else{
            user = await User.findOne({_id: decordedToken?._id, isDeleted: false}).lean()
        }

        if (!user) {
            throw new ApiError(BAD_REQUEST, i18n.__("INVALID_TOKEN"))
        }

        req.user = user;
        next()
    } catch (error) {
        next(error)
    }
}


export default AuthMiddleware;