const User=require("../models/user_model")

async function Search_user(user,email_search=false) {
    try{    
        let result = await User.findOne({ where: { email: user.email } });
        if(!result){
            return(false) } 
        if(email_search){
            return (result.id)
        }
        const match=await bcrypt.compare(user.password, result.password)
        //extracy the salt (hashing string) from hashed pass and use it to compare the two  
        console.log('user found ',result)
        if(match){ return(result.id) }// to get id instead of  object
        else{ return(null) }// use reject and error middleware 
    } catch (err) {
        console.error("Database error:", err);
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
        return new_user.insertId; // Return the last inserted ID
    } catch (err) {//removed in production
        console.error('Error adding user:', err);
        throw new Error('Failed to add user');
    }
}



async function Delete_user_account(id) {
    try {
        User.destroy({ where: { id: userId } });
        // console.log(`Deleted user with ID ${id}`);
        return deleteResult.affectedRows; // Return the number of affected rows
    } catch (err) {
        console.error('Error deleting user account:', err);
        throw new Error('Failed to delete user account');
    }
}
async function Reset_password(user_id,password){ //might deleted this and add it to update function 
    try{
    let hashed_password= await bcrypt.hash(password, rounds);
    const user =await USER.findOne({where:{id:user_id}})
    if (!user)  throw Object.assign(new Error('User Not Found'), { statusCode: 404 });
    await User.update( {password: hashed_password} , {where: {id:user_id}} )

    console.log("password updated with changes ",result.affectedRows)
    }catch(err) {
        console.error('Error resetting password:', err);
        throw new Error('Failed to reset password');
    }
}
module.exports={Search_user,Add_user,Delete_user_account,Reset_password}
