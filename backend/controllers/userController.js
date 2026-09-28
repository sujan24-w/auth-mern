require("dotenv").config();
const User= require("../models/users.model")

const getAllUser= async (req,res)=>{
try{

    const getUser= await User.find({});
    
    res.status(200).json({...getUser, message:"user successfully   fetched "});
}catch(err){
    res.status(500).json({message:"fetching  all user is  unsuccessful"})
}
};


const getUserData= async (req,res)=>{
    try{
        const userId= req.userId;
        const  user= await User.findById(userId);

        if( ! user){
         return   res.status(404).json({success:false,message:"user is not available with this id "})
        }
        
        
        res.status(200).json({success:true, userData:{
            email: user.email,
            username:user.username,
            isAccountVerify:user.isAccountVerify

        }})
    }catch(error){ 
        res.status(500).json({success:true,message:error.message})

    }
}

module.exports= {
    getAllUser,
    getUserData
}