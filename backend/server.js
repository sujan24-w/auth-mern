require("dotenv").config();
const express= require("express")
const cors= require("cors");
 const cookieParser= require("cookie-parser");
 const connectDB= require("./config/dbconfig");
 

 const app= express();
 const port= process.env.PORT || 4000 ;

  const allowsOrigin=['http://localhost:5173', 
         'https://auth-mern-beryl.vercel.app',
       

 ];
 app.use(cors({
    origin:allowsOrigin,
    credentials:true,
 }))

 connectDB();// db connected call 

 //middlewares
 app.use(cookieParser());
  app.use(express.urlencoded({extended:true}));
  app.use(express.json());
 



 //routes
const UserRouter= require("./routes/userRoutes")
const authRoute= require("./routes/authroutes");


 app.get("/",(req,res)=>{
    res.send("server started ") 
 })

app.use("/api/users", UserRouter );
app.use("/auth", authRoute);
 
 
 

 app.listen(port, ()=>{
    console.log(`server running at  port http://localhost:${port}`)
    
 })



