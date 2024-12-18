import bcrypt from "bcrypt"
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken"
import crypto from "crypto"


const Hashed_Password = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw error
    }
}

const comparePasswordUsingBcrypt = async (password, hashedPassword)=>{
    return bcrypt.compareSync(password, hashedPassword)
}

const isEmail = (value) => {
    let re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
}

const isPhone = (value) => {
    let intRegex = /[0-9 -()+]+$/;
    return intRegex.test(value);
}

const comparePasswordAndConfirmpassword = async (password, confirmPassword) => {
    if (password === confirmPassword) {
        return true;
    } else {
        return false;
    }
}

const generateOTP = () => {
    return otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}

const generateAccessToken = async (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: "USER"
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

const generateRefershToken = async(user) => {
    return jwt.sign({
        _id: user._id,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}


const jwtVerify = async(token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

 const jwtVerifyForRefreshToken = async(token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
}

const Utils = {
    Hashed_Password,
    comparePasswordUsingBcrypt,
    isEmail,
    isPhone,
    comparePasswordAndConfirmpassword,
    generateOTP,
    generateAccessToken,
    generateRefershToken,
    jwtVerify,
    jwtVerifyForRefreshToken
}
export default Utils;