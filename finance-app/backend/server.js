const http=require('http');
const app =require('./app.js')
require('dotenv').config({path:".env"})
console.log(process.env.PORT)


const server =http.createServer(app);

const port=process.env.PORT;
server.listen(port,'0.0.0.0',()=>{
    console.log("server running on port ",)
})