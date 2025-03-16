const expres =require('express')
const user_route=require("./Routes/auth_route")
const app=expres();

app.use("auth",user_route)
module.exports=app