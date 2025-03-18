const User=require("../models/user_model")
const bcrypt=require('bcrypt')

const rounds=10; 
async function Search_user(user,email_only_search=false) {
    try{    
        let result = await User.findOne({ where: { email: user.email } });
        if(!result){ 
            return(undefined) } 
        if(email_only_search){
            return (result.id)
        }
        const match=await bcrypt.compare(user.password, result.password)
        if(match){ return(result.id) }
        else{ return("Incorrect password") }
    } catch (err) {//re throw for debugging 
        console.error(err);
        throw new Error("Database error");
    }
    }


async function Add_user(user) {
    try {
        const hashed_password = await bcrypt.hash(user.password, rounds);
        const new_user = await User.create({
            email: user.email,
            password: hashed_password,
        });
        console.log('user Added ');
        return new_user.id; // Return the last inserted ID
    } catch (err) {//re throw for debugging 
        console.error(err);
        throw new Error('Failed to add user');
    }
}




async function Reset_password(user_id,password){ //might deleted this and add it to update function 
    try{
    let hashed_password= await bcrypt.hash(password, rounds);
    const user =await User.findOne({where:{id:user_id}})
    if (!user)  throw Object.assign(new Error('User Not Found'), { statusCode: 404 });
    const [affected_rows]=await User.update( {password: hashed_password} , {where: {id:user_id}} )
    console.log("password updated with number of changes ",affected_rows)
    }catch(err) {
        console.error('Error resetting password');
        throw new Error('Failed to reset password');
    }
}
module.exports={Search_user,Add_user,Reset_password}
