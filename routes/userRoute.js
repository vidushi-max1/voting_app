const express = require('express');
const router= express.Router();
const bcrypt= require('bcrypt');
const user = require('../models/user');  //importing user model 
const jwt= require('jsonwebtoken');
const generateToken= require('../jwt');

//user signup
router.post('/signup',async(req,res)=>{
    const data= req.body;
    try{

    //password encryption
    const pass= data.password;
    const password =await bcrypt.hashSync(pass,8);
    data.password= password;

    //create new user object using mongoose
    const newUser = new user(data);
    const response= await newUser.save();
    console.log(response._id)

    const payload={
        id:response._id
    }
    const token= generateToken(payload)
    res.status(200).json({response:response,token:token}) //here sending token 
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:'Internal server error'});
    }
})

//user login
router.get('/login',async(req,res)=>{
    const aadharcard =req.body.aadharcard;
    const password= req.body.password;
    console.log(aadharcard,password)
    try{
    const data= await user.findOne({aadharcard:aadharcard});
    console.log(data)
    if(!data){
        res.status(404).json({message:"aadharcard not found or does not match"}) 

    const passwordMatch = await bcrypt.compare(password,data.password);
    
    if(!passwordMatch){
        res.status(404).json({message:"password does not match"}) 
    }
    else{
        const token = generateToken(user.id)
        res.status(200).json({ token:token}); //here sending token with user id
    }
}

    }catch(err){
        res.status(500).json({message: "Internal server error"})
    }
})

module.exports = router;



