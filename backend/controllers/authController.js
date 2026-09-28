const bcrypt = require("bcryptjs");
const User = require("../models/users.model");
const jwt= require("jsonwebtoken");
const jwtKey=process.env.JWT_SECRET
const transports= require("../config/nodemailer.js");


const register= async (req,res)=>{

    const {username,email,password}= req.body;

    if(!username || !password || !email){
        return res.status(400).json({ success:false, message:"all field required email username, and password"})
    }

 console.log('passing throw registration');
  try{
     const existingUser= await User.findOne({email})
    if( existingUser){
        return   res.status(400).json({success:false,message:"user already exist"})
    }
     const hashedPassedword = await bcrypt.hash(password,10)
      
     const  user=  await User.create({
        username,
        email,
        password:hashedPassedword
     });
   const token= jwt.sign({
            userId:user._id, 
        },
            jwtKey,

            {expiresIn:'1d'}
        );

        res.cookie("token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==="production"? "none": "strict",
            maxAge: 1*24*60*60*1000
        });

// sending  email
      const mailOptions= {
        from:process.env.EMAIL_USER,
        to: email,
        subject: 'regestration ',
        text:`welcome  register success with email id: ${email} `,
        html:""
      }
      await transports.sendMail(mailOptions);

      return res.json({success:true});

        

  }catch(error){
   return  res.status(500).json({success:false, message:error.message})
  }

 
};


const userLogin= async (req, res)=>{
     const{email,password}= req.body;
     console.log(req.body);
     

     if(!email || !password ){
        return res.status(400).json({success:false, message:" correct Email And Password required to login "})
     }
     try{
        const user= await User.findOne({email});
        if(!user){
            return   res.status(409).json({success:false, message:"invalid email"})


        }
        console.log(user);
        
         const isMatch =  await bcrypt.compare(password,user.password);
         console.log(isMatch);
         
         if(! isMatch){
            return res.status(401).json({success: false, message:"invalid credentials/password"})
         }
          const token= jwt.sign({
            userId:user._id, 
        },
            jwtKey,

            {expiresIn:'1d'}
        );

        res.cookie("token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==="production"? "none": "strict",
            maxAge: 1*24*60*60*1000
        });


  return res.json({success:true,message:"login successful"});

     }catch(error){
        return   res.status(500).json({success:false, message:error.message})

     }

};

const logOut=  async (req,res)=>{
     try{
        res.clearCookie("token", {
             httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==="production"? "none": "strict",
           
        })
  
        return res.json({  success:true, message:"user logOut Successfully"})


     }catch(error){
       res.status(500).json({success:false, message:error.message})

     }
}



const sendVerifyOtp=  async (req,res)=>{
    try{

     const userId= req.userId;
     console.log('authentication  user id is ',userId);
     
    const  user=  await User.findById(userId);
    if(user.isAccountVerify){
        return res.json({success:false, message:"account  already vrify"})
    }

    const otp= String(Math.floor(100000 + Math.random()*900000));
    console.log(otp);
    
    user.verifyotp= otp;
    user.verifyOtpExpireAt=Date.now()+24*60*60*1000

    await user.save();
   
      const mailOptions= {
        from:process.env.EMAIL_USER,
        to: user.email,
        subject: 'Account verify otp ',
        text:`your otp is : ${otp} verify this account this  otp `,
        
      }
      await transports.sendMail(mailOptions)
      res.json({success:true, message:"verification  OPT is send  on email"});
    
    }catch(error){
        res.status(500).json({suceess:false,  message:error.message})
    }

}


const verifyEmail =  async (req,res)=>{
   const {otp} =  req.body;
   const userId= req.userId;
   console.log(` otp: ${otp},userId : ${userId}`);
   
   if(!otp || !userId){
    return  res.json({success:false, message:"Missing otp credentials or details "})
}
try{
 
const user= await  User.findById(userId);
if(!user){
       return  res.json({success:false, message:"User not found  "})

}
if( user.verifyotp==='' ||  user.verifyotp!==otp){
    return res.json({
        success:false,
        message:"INVALID opt"
    });  
}
if(user.verifyOtpExpireAt < Date.now()){
     return res.json({
        success:false,
        message:" opt is expired"
    });  
}
 user.isAccountVerify= true;
user.verifyotp="";
user.verifyOtpExpireAt=0;

await user.save();
return res.json({
        success:true,
        message:"Email verify success"
    }); 



}catch(error){
    res.status(500).json({success:false, message:error.message})
}
}


const isAuthenticated= async (req,res)=>{
    try{
     return  res.status(200).json({success:true})

    }catch(error){
       res.status(500).json({success:false, message:error.message})
    }
}

const sendResetOtp= async (req,res)=>{
    const email= req.body.email;

    if(!email){
        return res.json({success:false, message:"Email is required"})
    }
    try{
        const user = await User.findOne({email});
        if (! user){
            return res.json({success:true,message:"user not  found"})
        }
        const otp= String(Math.floor(100000 + Math.random()*900000));
    console.log(otp);
    
    user.resetOtp= otp;
    user.resetOtpExiireAt=Date.now()+15*60*1000

    await user.save();
   
      const mailOptions= {
        from:process.env.EMAIL_USER,
        to: user.email,
        subject: 'password reset  otp ',
        text:`your otp for resetting your password is : ${otp} Use this otp   to proceed with resetting tour passowrd.`,
        
      }
      await transports.sendMail(mailOptions);

      return res.json({
        success:true,
        message:"resend OTP to  your email"

      })


    }catch(error){
        res.status(500).json({success:false, message:error.message})

    }
}

const verifyResetOtp= async  (req,res)=>{
    const {email,otp}= req.body;
      if (!email || !otp) {
        return res.json({
            success: false,
            message: "Email and OTP are required"
        });
    }
 try{
      const user = await User.findOne({ email });
     if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }
       if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({
                success: false,
                message: "WRONG OTP"
            });
        } 
         if (user.resetOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP is expired"
            });
        } 
        return res.json({
            success: true,
            message: "OTP verified successfully"
        });
 }catch(error){
       return res.status(500).json({
            success: false,
            message: error.message
        });

 }


}


const verifyResetPassword= async (req,res)=>{
    const {otp,email,newPassword}= req.body;
   

    if(! otp || ! email || !newPassword){
      return   res.json({success:false,message:"invalid credentials i.e otp or email"})
    }

    try{
         const user= await  User.findOne({email}); 
         if(!user){
            return res.json({success:false, message:"user not found"});
         }

         if(user.resetOtp==="" || user.resetOtp !== otp){
            return res.json({success:false, message:'WRONG OTP'})
         }
         if(user.resetOtpExiireAt < Date.now()){
     return res.json({
        success:false,
        message:" opt is expired"
    });  
}
  const hashedPassedword = await bcrypt.hash(newPassword,10)
 user.password=hashedPassedword;
user.resetOtp="";
user.resetOtpExiireAt=0;

await user.save();
return res.json({
        success:true,
        message:"password reset  successfully"
    }); 




    }catch(error){
         res.status(500).json({success:false, message:error.message})

    }

}

module.exports= {
    register,
    userLogin,
    logOut,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendResetOtp,
    verifyResetOtp,
    verifyResetPassword,
}; 

