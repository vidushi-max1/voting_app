const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    age:{
        type:Number,    
    },
    email:{
        type:String,
    },
    mobile:{
        type:String,
    },
    address:{
        type:String,
        required:true
    },
    aadharcard:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    }, 
    isVoted:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },   
})

//create user model
const usermodel = mongoose.model('usermodel',userSchema);

//export user model
module.exports= usermodel;