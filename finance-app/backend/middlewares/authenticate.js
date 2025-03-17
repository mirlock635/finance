const Refresh_Token=require("../models/refresh_token_model")
const {save_token,get_token,delete_token,generate_refresh_tokken,
    set_tokens}=require("../Service/token_service")
    const jwt=require('jsonwebtoken')

async function authenticate(req,res,next){
    let decoded=await verify_token(req,res);
    if(!decoded)return res.status(401).json({ error: "Unauthorized" });
    req.user = decoded; // user here is decoded token object
    next();
}

async function verify_token(req,res) {
    const token = req.cookies.token;  // Access token from cookies
    const refresh_token = req.cookies.refresh_token;  // Refresh token from cookies
    if (!token) {
        let db_token_check=await get_token(refresh_token,Refresh_Token) //from db
        if (db_token_check&& db_token_check.expires_at > Date.now()) {
            return verify_refresh_token(refresh_token, res);  
        }else { res.status(401).json('Unauthorized'); return false}
    }
    try {
        console.log('verify tokken');
        return jwt.verify(token, JWT_SECRET);
    }catch (err){
        console.log('invalid access token');console.log('verify refresh')
        let new_token= await verify_refresh_token(refresh_token,res)// getting a new token
        if(new_token){
           console.log('set new access token ',new_token);
            set_tokens(res,new_token,refresh_token);//replced later
            return jwt.verify(new_token , JWT_SECRET);
        }else{ return false } //invalid refresh token
    }
}

async function verify_refresh_token(refresh_token,res){
        try{
            let decoded= jwt.verify(refresh_token, JWT_REFRESH_SECRET);
            console.log("refresh token exist")
            let new_access_token = generate_access_tokken(decoded.id);
            let new_refresh_token = generate_refresh_tokken(decoded.id);
            await delete_token(decoded.id,Refresh_Token);
            await save_token(new_refresh_token, decoded.id,Refresh_Token);
            set_tokens(res, new_access_token, new_refresh_token);
            return generate_tokken(decoded.id)
        }catch(err) {
            console.log('invalid refresh token')
            res.status(401).json('Invalid token')
            return false;
        }
}
module.exports=authenticate