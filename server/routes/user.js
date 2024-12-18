import {Router } from "express"
import UserControllers from "../controllers/user.js"

const userRouter = Router()

userRouter.post("/signup", UserControllers.Signup)
userRouter.post("/otp_verification", UserControllers.VerifyOTP)

export {
    userRouter
}