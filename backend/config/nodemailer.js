const nodemailer = require("nodemailer");

const transports = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

transports.verify((error,success)=>{
  if(error){
    console.log('Email connection error', error);

}else{
    console.log('Email server is ready');
    
}
    
})



module.exports=transports;