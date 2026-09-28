const express= require("express");
const userAuth= require("../middlewares/userAuth.js")
const userRouter= express.Router();

const {getAllUser,getUserData}= require("../controllers/userController");

userRouter.get("/",getAllUser);
userRouter.get("/user",userAuth,getUserData);



module.exports= userRouter; 