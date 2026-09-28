const mongoose= require("mongoose");


const connectDB= async ()=>{
    try{
        mongoose.connection.on("connected",()=>console.log("DB connected"))
        await  mongoose.connect(`${process.env.MONGODB_URI}/authmern`)
        
         
    }catch(err){
        console.log(err.message);
        process.exit(1); 
        

    }

}

module.exports=connectDB; 
