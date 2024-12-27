import { Router } from "express"
import HostControllers from "../controllers/host.js"
import AuthMiddleware from "../middlewares/auth.js"
import { upload } from "../middlewares/multer.js"


const hostRouter = Router()

hostRouter.post("/signup", HostControllers.Signup)
hostRouter.post("/otp-verification", HostControllers.VerifyOTP)
hostRouter.post("/resend", HostControllers.ResendOTP)
hostRouter.post("/forget-password", HostControllers.ForgetPassword)
hostRouter.post("/login", HostControllers.Login)

hostRouter.post("/profile-setup", AuthMiddleware, upload.fields([
    { name: "frontImage", maxCount: 10 },
    { name: 'backImage', maxCount: 10 },
    { name: 'avatar', maxCount: 1 },
]), HostControllers.ProfileSetup)

hostRouter.get("/get-profile", AuthMiddleware, HostControllers.GetProfile)
hostRouter.post("/logout", AuthMiddleware, HostControllers.Logout)
hostRouter.post("/reset-password", AuthMiddleware, HostControllers.ResetPassword)

hostRouter.post("/add-property", AuthMiddleware, upload.fields([
    { name: "images", maxCount: 10 }
]), HostControllers.AddProperty)
export {
    hostRouter
}