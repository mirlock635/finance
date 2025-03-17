const http=require('http');
const app =require('./app.js')
require('dotenv').config({path:"../.env"})

const server =http.createServer(app);

const port=process.env.PORT||3000;
server.listen(port,'0.0.0.0',()=>{
    console.log("server running on port ",port)
})