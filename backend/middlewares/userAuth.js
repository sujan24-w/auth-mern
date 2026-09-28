const jwt = require("jsonwebtoken");
const userAuth =  async (req,res,next) =>{
    console.log("COOKIES:", req.cookies);
    const {token}= req.cookies;

    if(!token){        
        return res.status(401).json({ 
            success:false,
            message: "Not Authorized login token  not available"
        });
    }
    try{
       const  tokenDecode= jwt.verify(token,process.env.JWT_SECRET);
       console.log("tokendecoded is :: ",tokenDecode);
       
       if(! tokenDecode.userId){
         console.log("userId NOT FOUND inside JWT");
         return res.json({
            success:false,
            message: "Not Authorized   login again "
        });
       }
       req.userId = tokenDecode.userId;
        console.log("req.userId:", req.userId);
         console.log("Calling next()...");
       next();

    }catch(error){
        return res.status(500).json({
            success:false,
            message: error.message
        });
    }

} 

module.exports= userAuth;