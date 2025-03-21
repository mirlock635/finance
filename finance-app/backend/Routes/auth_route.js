const express=require('express')
const cookieParser = require('cookie-parser');
const router =express.Router()
const Limiter=require('../middlewares/rate_limter')
const {validate_credentials,validate_new_password,validate_reset_email} = require("../middlewares/validate_credentials");
const {async_controller}=require("../utils/async_controller")

const auth_controller_raw=require("../Controllers/auth_controller")
const auth_controller =  async_controller(auth_controller_raw) // can be moved to the service export

router.use(Limiter)

router.use(express.json())
router.post("/signin",validate_credentials,auth_controller.signin)
router.post("/login",validate_credentials,auth_controller.login)

router.use(cookieParser())
//router.get("/logout",auth_controller.logout) 

router.post("/reset_password_request",validate_reset_email,auth_controller.handle_password_request)
router.post("/reset_password/:reset_token",validate_new_password,auth_controller.handle_password_reset)

module.exports=router