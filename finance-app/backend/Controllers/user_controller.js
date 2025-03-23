const {Delete_user_account}=require("../Service/user_service")
 const {clear_tokens,delete_token}=require("../Service/token_service")
 const Refresh_Token=require("../models/refresh_token_model")

async function delete_account(req,res){
    const id= req.user_id;// user here is decoded token object
    const changes=await Delete_user_account(id)
    console.log("user deleted ",changes)
    if (changes>0) {
        clear_tokens(res);
         res.status(200).json({message:'user deleted'})
        console.log('deleting response sent');
    } else {
        console.log('user not found')
        res.status(404).json({error:'User not found'})
       return
    }

}
module.exports={delete_account}