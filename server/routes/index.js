import {Router} from "express"
import { userRouter } from "./user.js"
import { adminRouter } from "./admin.js"
import { hostRouter } from "./host.js"

const router = Router()

router.use("/user", userRouter)
router.use("/admin", adminRouter)
router.use("/host", hostRouter)

export {
    router
}