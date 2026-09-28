const { verify } = require("jsonwebtoken");
const mongoose= require("mongoose");

const  userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    verifyotp:{
        type:String,
        default:"",
    },
     verifyOtpExpireAt:{
        type:Number,
        default:0,
    },
    isAccountVerify:{
        type:Boolean,
        default:false, 
    },
    resetOtp:{
        type:String,
        default:"",
    },
    resetOtpExiireAt:{
        type:Number,
        default:0
    },
},{timestamps:true})

const  User= mongoose.model("user",userSchema)
module.exports= User;