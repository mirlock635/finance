const express =require('express')
const auth_route=require("./Routes/auth_route")
const user_route=require("./Routes/user_routes")
const error_handler=require('./middlewares/error_middleware')
const app=express();
const cors = require('cors');
const helmet=require("helmet")
const morgan=require("morgan")
const Dynamic_rate_limiter=require('./middlewares/rate_limter')


app.use(Dynamic_rate_limiter)

app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],  // Change this to your frontend URL if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

app.use(helmet());
app.use(morgan("dev")); 

app.use("/auth",auth_route)
app.use("/user",user_route)
/*
app.use('/css',express.static('assets/css'))
app.use('/js',express.static('assets/js'))
app.use('/img',express.static('assets/img'))
app.use("/",express.static('assets'))
app.use("/",(req,res)=>{
  const file_path=path.join(__dirname,"assets/signup.html")
  console.log("path "+file_path)
  res.sendFile(file_path)
})
*/
app.use(error_handler)

module.exports=app