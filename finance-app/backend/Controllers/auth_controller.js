
let JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET


async function signin(req,res){

let user=req.body//not sure here verify others as well for non body parameters since middleware don't return
let result=await Search_user(user,true)
console.log(result)
if(result){
    console.log("already exist")
    return res.status(409).json({error:"User found, try another email"}) // status code for conflict
} else {
const user_id= await addUser(user)
console.log('new user id : ',user_id)
if(user_id>=0){
    return res.status(200).json({message:"user added",id:user_id})  
}else{     return res.status(500).json({error:'Internal Server Error'})
}
}
}

async function login(req,res){
    try{
       const user=req.body
       const user_id = await Search(user); console.log('search for user',user_id) //thinking of seperate email and pass search
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
   }catch(err){
       console.error('Error in handle_Signin:', err);
       return res.status(500).json({error:'Internal Server Error'})
   }

}


async function handle_password_request(req, res) {
    try {
        const { email } = req.body;
        console.log("searching")
        let id = await Search({ email }, true); 
        console.log("id ",id) // Search user by email
        if (id && id >= 0) {
            await delete_token(id,"reset_tokens");  // Remove old reset tokens
            let token = generate_reset_token();
            await save_token(id, token,"reset_tokens");
            await send_reset_email(email , token);
        }else{
            res.status(400).json({ message: "failed email sending " });
        }

        res.status(200).json({ message: " a reset link has been sent." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error." });
    }
}
async function handle_password_reset(req, res) {
        const { reset_token , password } = req.body;
        let row = await get_token(reset_token,"reset_tokens");
        if (!row) {
            return res.status(404).json({ error: "Invalid reset token" });
        }
/* btw if this token randomly generated then why not just make refresh token like this 
and check its validation from its table instead of use jwt to check its date ?
so if i use that jwt benefit is  only check if it's made from the secret key but does that matter a lot ?
*/
        const { user_id, expires_at } = row;
        console.log('id ',user_id,"expire ",expires_at)
        if (expires_at < Date.now()) {
            await delete_token(user_id,"reset_tokens");
            return res.status(400).json({ error: "Reset token expired" });
        }
        let changes = await reset_password(user_id, password);
        if (changes === 0) {
            return res.status(500).json({ error: "Failed to reset password" });
        }

        await delete_token(user_id,"reset_tokens");
        res.json({ message: "Password reset successfully" });
}