 const {register,
       userLogin,
       logOut,
       verifyEmail,
       sendVerifyOtp,
       isAuthenticated,
       sendResetOtp,
       verifyResetOtp,
      verifyResetPassword,
  }=  require("../controllers/authController");
const userAuth= require("../middlewares/userAuth.js")
const {Router} =require("express")
  const authRoute=Router();

  authRoute.post("/register",register);
  authRoute.post("/login",userLogin);
  authRoute.post("/logout",logOut);
  authRoute.post("/sent-verify-otp",userAuth,sendVerifyOtp);
  authRoute.post("/emailverify",userAuth,verifyEmail);
  authRoute.get("/isauth",userAuth,isAuthenticated);
  authRoute.post("/send-resetotp",sendResetOtp);
  authRoute.post("/verify-resetotp",verifyResetOtp);
  authRoute.post("/resetpassword",verifyResetPassword);


 module.exports= authRoute;
