import {Router} from "express"
import { userRouter } from "./user.js"
import { adminRouter } from "./admin.js"

const router = Router()

router.use("/user", userRouter)
router.use("/admin", adminRouter)

export {
    router
}