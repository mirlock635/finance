const {Delete_user_account}=require("../Service/user_service")


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