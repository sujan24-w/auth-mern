require("dotenv").config();
const express= require("express")
const cors= require("cors");
 const cookieParser= require("cookie-parser");
 const connectDB= require("./config/dbconfig");
 

 const app= express();
 const port= process.env.PORT || 4000 ;

 
 const allowsOrigin=['http://localhost:5173',
      'https://auth-mern-beryl.vercel.app',
      'https://auth-mern-ofhcxho5r-sujan-s-projects-b8ff6630.vercel.app',
      'https://auth-mern-4dl4pf3iw-sujan-s-projects-b8ff6630.vercel.app'

];
 app.use(cors({
    credentials:true,
    origin: allowsOrigin,
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



