const User=require("../models/user_model")

async function Search_user(user,email_only_search=false) {
    try{    
        let result = await User.findOne({ where: { email: user.email } });
        if(!result){ 
            return(false) } 
        if(email_only_search){
            return (result.id)
        }
        const match=await bcrypt.compare(user.password, result.password)
        console.log('user found ',result)
        if(match){ return(result.id) }
        else{ return(null) }
    } catch (err) {//re throw for debugging 
        console.error("Database error");
        throw err;
    }
    }


async function Add_user(user) {
    try {
        const hashed_password = await bcrypt.hash(user.password, rounds);
        const new_user = await User.create({
            email: user.email,
            password: hashed_password,
        });
        console.log('Added the user');
        return new_user.id; // Return the last inserted ID
    } catch (err) {//re throw for debugging 
        console.error('Error adding user');
        throw new Error('Failed to add user');
    }
}



async function Delete_user_account(id) {
    try {
        const deleted_count=await User.destroy({ where: { id: userId } });
        console.log(`Deleted users with ID ${id}`);
        return deleted_count; // Return the number of affected rows
    } catch (err) {
        console.error('Error deleting user account:', err);
        throw new Error('Failed to delete user account');
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
module.exports={Search_user,Add_user,Delete_user_account,Reset_password}
