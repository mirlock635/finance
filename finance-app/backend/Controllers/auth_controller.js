
const Refresh_Token=require("../models/refresh_token_model")
const Reset_Token=require("../models/reset_token_model")
const {Search_user,Add_user,Reset_password}=require("../Service/auth_service")
const {save_token,get_token,delete_token,generate_refresh_token,generate_access_token,
    generate_reset_token,set_tokens}=require("../Service/token_service")
const send_reset_email=require("../Service/email_service");

async function signin(req,res){
let user=req.body
let result=await Search_user(user,true) //true for  email only search
console.log("user id",result)
if(result){
    return res.status(409).json({error:"Email already used. Try a different one"}) // status code for conflict
} else {
const user_id= await Add_user(user)
if(user_id>=1){
    return res.status(201).json({message:"User created",id:user_id})  
}else{
    return res.status(500).json({error:'Internal Server Error'})
}
}
}

async function login(req,res){
       const user=req.body
       const user_id = await Search_user(user); console.log('search for user',user_id) //thinking of seperate email and pass search
       if(!user_id){
        res.status(404).json({error:'user not found'})
       return }

        if(user_id=="Incorrect password"){
               res.status(400).json('Incorrect password')
               return
        }
        const tokken=generate_access_token(user_id);
        const refresh_token=generate_refresh_token(user_id); //console.log('created access tokken ',tokken); console.log("created refresh_token",refresh_token);
        await delete_token(user_id,Refresh_Token); //delete old tokens
        await save_token(user_id,refresh_token,Refresh_Token)
        set_tokens(res,tokken,refresh_token);
        res.status(200).json("login successfully")       
}



async function handle_password_request(req, res) {
        const { email } = req.body;
        console.log("searching ,",email)
        let id = await Search_user({ email }, true); 
        console.log("id ",id) // Search user by email
        if (id && id >= 0) {
            await delete_token(id,Reset_Token);  // Remove old reset tokens
            let token = generate_reset_token();
            await save_token(id, token,Reset_Token,1);
            await send_reset_email(email , token);
        }else{
            res.status(400).json({ message: "failed email sending " });
        }

        res.status(200).json({ message: " a reset link has been sent." });
}

async function handle_password_reset(req, res) {
        const { password } = req.body;
        const reset_token=req.params.reset_token;
        let row = await get_token(reset_token,Reset_Token);
        if (!row) {
            return res.status(404).json({ error: "Invalid reset token" });
        }
        const { user_id, expires_at } = row;
        console.log('id ',user_id,"expire ",expires_at)
        if (expires_at < Date.now()) {
            await delete_token(user_id,Reset_Token);
            return res.status(400).json({ error: "Reset token expired" });
        }
        let changes = await Reset_password(user_id, password);
        if (changes === 0) {
            return res.status(500).json({ error: "Failed to reset password" });
        }
        await delete_token(user_id,Reset_Token);
        res.json({ message: "Password reset successfully" });
}
module.exports={signin,login,handle_password_request,handle_password_reset}