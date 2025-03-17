const User=require("../models/user_model")

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

module.exports={Delete_user_account}