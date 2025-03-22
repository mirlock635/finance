// models are passed through parameters no need to call
const jwt=require('jsonwebtoken');
const crypto = require('crypto');

const  JWT_SECRET=process.env.JWT_SECRET
const JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET
const access_token_age=120;
const refresh_token_age=604800;

async function save_token(user_id,token,token_model,expires_in_days=7*24*4){
    console.log("save token",token,"user_id",user_id,token_model)
    const expires_at=Date.now()+1000*60*15*expires_in_days;
    const result = await token_model.create({ token, expires_at, user_id });
    console.log(" Token  saved id", result.id,"result",result.dataValues); //create have the instance of user
}
async function get_token(token,Token_model){
    console.log("token",token)
    const result=await Token_model.findOne( {where:{token}} )
    console.log('token result object  ',result)
    return result  // Return row with user_id and reset_expires
}
async function delete_token(user_id,Token_model){
    const result =await Token_model.destroy({ where: { user_id } });
    if(result=== 0){ console.log(' no token deleted , changes : ',result)}
    else{ console.log("token deleted , changes : ",result); }
}

// utils token functions  

function generate_reset_token() {
    return crypto.randomBytes(32).toString('hex');
  }
function generate_access_token(user_id){
    return jwt.sign({id:user_id},JWT_SECRET,{expiresIn:'1m'});
    }
function generate_refresh_token(user_id){
        return jwt.sign({id:user_id},JWT_REFRESH_SECRET,{expiresIn:'1m'});
    }
function generate_verification_token(){
return crypto.randomBytes(32).toString("hex");
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

module.exports={save_token,get_token,delete_token,generate_refresh_token,
    generate_access_token,generate_reset_token,clear_tokens,set_tokens,generate_verification_token}
