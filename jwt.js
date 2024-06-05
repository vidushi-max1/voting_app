const jwt= require('jsonwebtoken');

//generating token
const generateToken = (userData)=>{
    return jwt.sign({userData: userData},process.env.SECRET)
}

module.exports= generateToken;
//verify token
