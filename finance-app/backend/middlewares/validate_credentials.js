
let email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validate_credentials(req,res,next){
    let {email,password}=req.body
        if(!(email_pattern.test(email) && password.length >= 8)){
            console.log('Invalid credentials')
            return res.status(400).json({error:'Invalid credentials'}); 
           }//handle with error middleware
    next()
}
function validate_reset_email(req,res,next){
    let {email}=req.body
    if(!email_pattern.test(email)){
            console.log('Invalid email')
            return res.status(400).json({error:'Invalid Email'}); 
           }//handle with error middleware
    next()
}
function validate_new_password(req,res,next){
    let {password}=req.body
    if(password.length < 8){
            console.log('Invalid Password')
            return res.status(400).json({error:'Invalid Password'}); 
           }//handle with error middleware
    next();
}
module.exports={validate_credentials,validate_new_password,validate_reset_email}