const express = require('express')
const router =express.Router()
const auth_controller=require("../Controllers/auth_controller")
const rateLimit = require('express-rate-limit')

router.use(Limiter)

router.use(express.json())
router.post("/signin",validate_credentials,auth_controller.signin)
router.post("/login",validate_credentials,auth_controller.login)

router.use(cookieParser())
router.get("/logout",auth_controller.logout) 
router.delete("/delete_account",authenticate,auth_controller.delete_account)

router.post("/password_loss",auth_controller.handle_password_loss)
router.post("/reset_password",auth_controller.handle_password_reset)

module.exports=router