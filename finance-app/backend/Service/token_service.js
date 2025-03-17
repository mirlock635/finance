// models are passed through parameters no need to call
const jwt=require('jsonwebtoken');
const crypto = require('crypto');

const  JWT_SECRET=process.env.JWT_SECRET
const JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET
const access_token_age=120;
const refresh_token_age=604800;

async function save_token(user_id,token,token_model){
    const expires_at=Date.now()+1000*3600*24*7;
    const result = await token_model.create({ token, expires_at, user_id });
    console.log("refresh Token saved", result.id); //create have the instance of user
}
async function get_token(token,Token_model){
    console.log("token",token)
    const result=await Token_model.findOne( {where:{token}} )
    console.log('row of getting  token',result)
    return result  // Return row with user_id and reset_expires
}
async function delete_token(user_id,Token_model){
    const result =await Token_model.destroy({ where: { user_id } });
    if(result=== 0){ console.log(' no token deleted , changes : ',result)}
    else{ console.log("token deleted , changes : ",result); }
}

// utils token functions  

function generate_reset_token() {
    return crypto.randomBytes(20).toString('hex');
  }
function generate_access_token(user_id){
    return jwt.sign({id:user_id},JWT_SECRET,{expiresIn:'2m'});
    }
function generate_refresh_token(user_id){
        return jwt.sign({id:user_id},JWT_REFRESH_SECRET,{expiresIn:'7d'});
    }
function set_tokens(res, token, refresh_token) {
    res.setHeader('Set-Cookie', [
        `token=${token}; HttpOnly; SameSite=Lax; Max-Age=${access_token_age}; Path=/`,
        `refresh_token=${refresh_token}; HttpOnly; SameSite=Lax; Max-Age=${refresh_token_age}; Path=/`
    ]);
        console.log("set tokens");
    }
function clear_tokens(res){
    res.setHeader("Set-Cookie", [
        "token=; HttpOnly; Max-Age=0; Path=/",
        "refresh_token=; HttpOnly; Max-Age=0; Path=/"
    ]);
    console.log(" tokens cleared");

}
async function authenticate(req,res,next){
    let decoded=await verify_token(req,res);
    if(!decoded)return
    req.user = decoded; // user here is decoded token object
    next();
}

async function verify_token(req,res) {
    const token = req.cookies.token;  // Access token from cookies
    const refresh_token = req.cookies.refresh_token;  // Refresh token from cookies
    if (!token) {
        let db_token_check=await get_token(refresh_token,"refresh_tokens") //from db
        if (db_token_check&& db_token_check.expires_at > Date.now()) {
            return verify_refresh_token(refresh_token, res);  
        }else { res.status(401).json('Unauthorized'); return}
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
            await delete_token(decoded.id,"refresh_tokens");
            await save_token(new_refresh_token, decoded.id);
            set_tokens(res, new_access_token, new_refresh_token);
            return generate_tokken(decoded.id)
        }catch(err) {
            console.log('invalid refresh token')
            res.status(401).json('Invalid token')
            return false;
        }
}
module.exports={save_token,get_token,delete_token,generate_refresh_token,
    generate_access_token,generate_reset_token,clear_tokens,set_tokens}
