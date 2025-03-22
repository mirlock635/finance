const express=require('express')
const router =express.Router()
const {delete_account}=require("../Controllers/user_controller")
const {async_handler}=require("../utils/async_controller")
let authenticate=require("../middlewares/authenticate")
 authenticate=async_handler(authenticate);
const cookieParser = require('cookie-parser');

router.use(express.json())
router.use(cookieParser())

router.delete("/delete_account",authenticate,delete_account)
module.exports=router