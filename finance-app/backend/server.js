const http=require('http');
const app =require('./app.js')
require('dotenv').config({path:".env"})
console.log(process.env.PORT)


const server =http.createServer(app)
server.listen()