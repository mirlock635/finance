const User=require("../models/user_model")
const Verification_token=require("../models/verification_token_model")
const {save_token,generate_verification_token}=require("../Service/token_service")
const bcrypt=require('bcrypt')

const rounds=10; 

async function search_user_by_email(email) {
      const result = await User.findOne({ where: { email } });
      return result ? result: undefined;
  }
async function verify_user(user) {
    try{   
        let result = await search_user_by_email(user.email)
        if(!result) return(undefined) 
        const match=await bcrypt.compare(user.password, result.password)
        if(!match) return("Incorrect password")
        if(!result.is_verified) throw new Error("Email not verified")        
        return(result.id);
    }catch(err){
        console.error("login failed",err);
        if(err.message=="Email not verified")throw err
        throw new Error('Failed to add user');  
    }
   }

   async function validate(req){
    console.log("token",req.params.v_token)
    const user_id=req.user_id
    console.log("user_id",req.user_id)
    const result =await User.update({is_verified:true},{where:{id:user_id}})
    if(!result) return(undefined) 
    //delete the token
    return true
   }
async function Add_user(user) {
    try {
        const hashed_password = await bcrypt.hash(user.password, rounds);
        const new_user = (await User.create({
            email: user.email,
            password: hashed_password })).dataValues;  console.log('user Added ',new_user);
        let token=generate_verification_token();
        await save_token(new_user.id,token,Verification_token,4)
        return {user_id:new_user.id,token}; // Return the last inserted ID
    } catch (err) {//re throw for debugging 
        console.error(err);
        throw new Error('Failed to add user');
    }
}




async function Reset_password(user_id,password){ //might deleted this and add it to update function 
    try{
    let hashed_password= await bcrypt.hash(password, rounds);
    const user =await User.findOne({where:{id:user_id}})
    if (!user)  throw new Error('User Not Found');
    const [affected_rows]=await User.update( {password: hashed_password} , {where: {id:user_id}} )
    console.log("password updated with number of changes ",affected_rows)
    }catch(err) {
        console.error('Error resetting password :' ,err);
        throw new Error('Failed reset password');
    }
}
module.exports={validate,search_user_by_email,verify_user,Add_user,Reset_password}
