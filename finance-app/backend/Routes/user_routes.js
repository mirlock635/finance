const express=require('express')
const router =express.Router()
const Limiter=require('../middlewares/rate_limter')
const {delete_account}=require("../Controllers/user_controller")
const authenticate=require("../middlewares/authenticate")
const cookieParser = require('cookie-parser');

router.use(Limiter)
router.use(express.json())
router.use(cookieParser())

router.delete("/delete_account",authenticate,delete_account)
module.exports=router