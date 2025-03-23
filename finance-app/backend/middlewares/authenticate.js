const Refresh_Token=require("../models/refresh_token_model")
const {save_token,get_token,delete_token,generate_access_token
    ,generate_refresh_token,set_tokens}=require("../Service/token_service")
const Verification_token=require('../models/verification_token_model')
const jwt=require('jsonwebtoken')

const  JWT_SECRET=process.env.JWT_SECRET
const JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET
async function authenticate_verification_token(req,res,next){
    let token=req.params.v_token;
    console.log("token",token)
    if(!token) {
        console.error('no token')
        return res.status(400).json({error:"invalid link"})
    }
    const db_token=await Verification_token.findOne({where: {token}})
    console.log("db_token",db_token)
    if(!db_token) return res.status(400).json({error:"invalid verification link"})
    if (db_token.expires_at < Date.now()) {
        await Verification_token.destroy({ where: { token } }); // Cleanup expired token
        return res.status(400).json({ error: "Verification link has expired. Please request a new one." });
    }
    req.user_id=db_token.dataValues.user_id;
    next();
}

async function authenticate(req,res,next) {
    const token = req.cookies.token;  // Access token from cookies
    const refresh_token = req.cookies.refresh_token;  // Refresh token from cookies
    if (token) {
        try {
            console.log('verify access tokken',token);
            let {id}= jwt.verify(token, JWT_SECRET);
            if (!id) throw new Error("Invalid token payload");
            req.user_id=id; // set id from token for auth_controller to use
            return next();
        }catch (err){
                if (err.name === "TokenExpiredError") {
                console.warn("Access token expired, attempting refresh...");
            } else if(err.message=="Invalid token payload"){
                throw err
            }
            console.error("Invalid access token:", err.message);//expected  
        }      
    }
    console.error("invalid access token" )
    if(refresh_token){
        console.log('verify refresh');
        req.user_id= await verify_refresh_token(refresh_token,res);//return id 
        return next();
    }else{ console.error("Unauthorized: Missing refresh token")
    return res.status(401).json({ error: "Unauthorized " });
    }

}

async function verify_refresh_token(refresh_token,res){
let decoded_token=jwt.verify(refresh_token, JWT_REFRESH_SECRET);//check for secret key
if (!decoded_token.id) {
    throw  Object.assign(new Error("Unauthorized: Token missing user ID"), { statusCode: 401 });
}
// token_object
let db_token=await get_token(refresh_token,Refresh_Token); //get from db to protect against manipulation
if (!db_token || db_token.expires_at <= Date.now()) {
    await rotate_tokens(db_token,res);    // delete the token if expired
    throw  Object.assign(new Error('Unauthorized invalid refresh token'), { statusCode: 401 });
}
return await rotate_tokens(db_token,res);
}

async function rotate_tokens(refresh_token,res){
    let new_access_token = generate_access_token(refresh_token.id);
    let new_refresh_token = generate_refresh_token(refresh_token.id);
    await delete_token(refresh_token.user_id,Refresh_Token);
    await save_token(refresh_token.user_id,new_refresh_token,Refresh_Token);
    set_tokens(res, new_access_token, new_refresh_token);
    return refresh_token.user_id
}  


module.exports={authenticate,authenticate_verification_token}