import { Router } from "express"
import HostControllers from "../controllers/host.js"
import AuthMiddleware from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.js"

const hostRouter = Router()

hostRouter.post("/signup", HostControllers.Signup)
hostRouter.post("/otp_verification", HostControllers.VerifyOTP)
hostRouter.post("/resend", HostControllers.ResendOTP)
hostRouter.post("/forget-password", HostControllers.ForgetPassword)
hostRouter.post("/login", HostControllers.Login)

hostRouter.post("/profile-setup",AuthMiddleware, upload.fields({name: "frontImage", maxCount: 1}, {name: "backImage", maxCount: 1}, {name: "avatar", maxCount: 1}) )
hostRouter.get("/get-profile", AuthMiddleware, HostControllers.Login)
hostRouter.post("/logout", AuthMiddleware, HostControllers.Logout)
hostRouter.post("/reset-password", AuthMiddleware, HostControllers.ResetPassword)

export {
    hostRouter
}