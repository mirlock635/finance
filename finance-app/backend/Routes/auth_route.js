const express = require('express')
const router =express.Router()
const auth_controller=require("../Controllers/auth_controller")
const Limiter=require('../middlewares/rate_limter')
router.use(Limiter)

router.use(express.json())
router.post("/signin",validate_credentials,auth_controller.signin)
router.post("/login",validate_credentials,auth_controller.login)

router.use(cookieParser())
router.get("/logout",auth_controller.logout) 
router.delete("/delete_account",authenticate,auth_controller.delete_account)

router.post("/reset_password_request",auth_controller.handle_password_request)
router.post("/reset_password",auth_controller.handle_password_reset)

module.exports=router