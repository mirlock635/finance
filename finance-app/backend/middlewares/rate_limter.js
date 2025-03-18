const rateLimit = require('express-rate-limit')

const Limiter=rateLimit({
    max:50,
    WindowMs:60 *1000,
    message:{error:"Too many requests, please try again later."}
}) 
module.exports=Limiter