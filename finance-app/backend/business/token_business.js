
// models are passed through parameters no need to call
async function save_token(user_id,token,token_model){
    const expire_at=Date.now()+1000*3600*24*7;
    const result = await token_model.create({ token, expire_at, user_id });
    console.log("refresh Token saved", result.id); //create have the instance of user
}
async function get_token(token,Token_model){
    const token=await Token_model.findOne( {where:{token}} )
    console.log('row of getting  token',token)
    return token  // Return row with user_id and reset_expires
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
function generate_access_tokken(user_id){
    return jwt.sign({id:user_id},JWT_SECRET,{expiresIn:'2m'});
    }
function generate_refresh_tokken(user_id){
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
module.exports={save_token,get_token,delete_token,generate_refresh_tokken,generate_access_tokken,generate_reset_token,clear_tokens,set_tokens}
