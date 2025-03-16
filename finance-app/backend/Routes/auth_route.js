const express=require('express')
const cookieParser = require('cookie-parser');
const router =express.Router()
const Limiter=require('../middlewares/rate_limter')

const auth_controller=require("../Controllers/auth_controller")
const async_controller=require("../utils/async_controller")
auth_controller =  async_controller(auth_controller)

router.use(Limiter)

router.use(express.json())
router.post("/signin",validate_credentials,auth_controller.signin)
router.post("/login",validate_credentials,auth_controller.login)

router.use(cookieParser())
router.get("/logout",auth_controller.logout) 

router.post("/reset_password_request",auth_controller.handle_password_request)
router.post("/reset_password",auth_controller.handle_password_reset)

module.exports=router