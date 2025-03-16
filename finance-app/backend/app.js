const expres =require('express')
const user_route=require("./Routes/user_route")
const app=expres();

app.use("user",user_route)
module.exports=app