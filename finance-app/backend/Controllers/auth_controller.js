
const Refresh_Token=require("../models/refresh_token_model")
const Reset_Token=require("../models/reset_token_model")
const {Search_user,Add_user,Delete_user_account,Reset_password}=require("../business/auth_business")


async function signin(req,res){
let user=req.body
let result=await Search_user(user,true) //true for  email only search
console.log(result)
if(result){
    console.log("already exist")
    return res.status(409).json({error:"User found, try another email"}) // status code for conflict
} else {
const user_id= await Add_user(user)
if(user_id>=0){
    return res.status(200).json({message:"user added",id:user_id})  
}else{     return res.status(500).json({error:'Internal Server Error'})
}
}
}

async function login(req,res){
       const user=req.body
       const user_id = await Search_user(user); console.log('search for user',user_id) //thinking of seperate email and pass search
       if(user_id){
           if(!user_id){
               res.status(400).json('Incorrect password')
               return
           }
           const tokken=middleware.generate_access_tokken(user_id);
           const refresh_token=middleware.generate_refresh_tokken(user_id); //console.log('created access tokken ',tokken); console.log("created refresh_token",refresh_token);
           await save_token(user_id,refresh_token,"refresh_tokens")
           middleware.set_tokens(res,tokken,refresh_token);
           res.status(200).json("login successfully")
           return
       }else{
           res.status(404).json({error:'user not found'})
           return
       }
}

async function delete_account(req,res){
    const id= req.user.id;// user here is decoded token object
    const changes=await Delete_user_account(id)
    console.log("user deleted ",changes)
    if (changes>0) {
         res.status(200).json({message:'user deleted'})
        console.log('deleting response sent')
    } else {
        console.log('user not found')
        res.status(404).json('User not found')
       return
    }

}

async function handle_password_request(req, res) {
        const { email } = req.body;
        console.log("searching")
        let id = await Search_user({ email }, true); 
        console.log("id ",id) // Search user by email
        if (id && id >= 0) {
            await delete_token(id,Reset_Token);  // Remove old reset tokens
            let token = generate_reset_token();
            await save_token(id, token,Reset_Token);
            await send_reset_email(email , token);
        }else{
            res.status(400).json({ message: "failed email sending " });
        }

        res.status(200).json({ message: " a reset link has been sent." });
}

async function handle_password_reset(req, res) {
        const { reset_token , password } = req.body;
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
module.exports={signin,login,handle_password_request,handle_password_reset,delete_account}