import {Router } from "express"
import UserControllers from "../controllers/user.js"
import AuthMiddleware from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.js"

const userRouter = Router()

userRouter.post("/signup", UserControllers.Signup)
userRouter.post("/otp_verification", UserControllers.VerifyOTP)
userRouter.post("/resend", UserControllers.ResendOTP)
userRouter.post("/update-profile",upload.single("avatar"), UserControllers.UpdateProfile)
userRouter.post("/forget-password", UserControllers.ForgetPassword)
userRouter.post("/login", UserControllers.Login)

userRouter.get("/get-profile",AuthMiddleware,  UserControllers.Login)
userRouter.get("/logout",AuthMiddleware,  UserControllers.Logout)

export {
    userRouter
}