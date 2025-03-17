const http=require('http');
const app =require('./app.js')
console.log('server Current working directory:', process.cwd());

console.log("env from server ",process.env.DB_USER)

const server =http.createServer(app);

const port=process.env.PORT||3000;
server.listen(port,'0.0.0.0',()=>{
    console.log("server running on port ",port)
})