
async function logout(req,res){
    try{
        /*handle log out with only refresh token cause both tokens will be removed (from log out) either way  after  you create new token from the refresh *///error handled inside get_cookies i wonder if this right approach
        const refresh_token = req.cookies.refresh_token; 
         console.log("refresh_token from logout : ",refresh_token)
         if(!refresh_token){//maybe can be optimized
            res.status(401).json({error:'Invalid token'});return
         }
            try{
            result=jwt.verify(refresh_token, JWT_REFRESH_SECRET);//do i need return ?
            }catch(err){     
                console.error(err)
                console.log('invalid refresh token')
                middleware.clear_tokens(res);// clear tokens anyway to not send invalid tokens
                await delete_token(result.id,"refresh_tokens")
                res.status(401).json({error:'Invalid refresh token'})
                ;return
            }
            middleware.clear_tokens(res)//empty tokens
            await delete_token(result.id,"refresh_tokens")
            res.status(200).json('Logged out successfully')
            console.log("logout response sent ")
            return 
    }catch(err){
        console.error(" logout failed ",err)
        return res.status(500).json({error:'Internal Server Error'})        
    }
}
