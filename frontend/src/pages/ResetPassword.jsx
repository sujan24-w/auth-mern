import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContex';
import axios from 'axios';
import { toast } from 'react-toastify';



function ResetPassword() {
 const navigate= useNavigate();

const {backendUrl,getUserData,isLoggedIn,}= useContext(AppContext)



 const [email, setEmail]= useState("");
 const [newPassword, setNewPassword]= useState("");
const [isEmailSent, setIsEmailSent]=useState(false)

const [isOtpSubmit, setIsOtpSubmit]=useState(false)



 
const [otp,setOtp]= useState(["","","","","",""])
const inputRefs= React.useRef([]);

const handleinputOtp= (e,index)=>{
  const newOtp=[...otp]
  newOtp[index]= e.target.value
  setOtp(newOtp);
  if(e.target.value.length >0 && index < 5){
    inputRefs.current[index+1].focus()
  }
}

const  clearOtpfield= (e,index)=>{
  if(e.key=="Backspace" &&  e.target.value=="" && index>0){
    inputRefs.current[index-1].focus()
  }
}
const handlepaste= (e)=>{

const paste= e.clipboardData.getData("text")
const pasteArray= paste.split("").slice(0,6);
const newOtp=[...otp];
pasteArray.forEach((letter,index)=>{
  newOtp[index]= letter;
})
setOtp(newOtp);
}
const handleOtpSubmit= async (e)=>{
e.preventDefault();
  try{
 const otpValue= otp.join("");

console.log(otpValue);

const {data} = await axios.post(backendUrl+"/auth/emailverify", {otp:otpValue},{withCredentials: true })

if( data.success){
  toast.success(data.message)
  
   getUserData();
   navigate("/")

}else{
  toast.error(data.message)
}
   console.log(data);
   
  }catch(error){
  console.log(error.message);
  toast.error(error.message)
  

  }
  
}
const OnSubmitEmail= async (e)=>{
  e.preventDefault();
  try{
    const {data}= await axios.post(backendUrl+"/auth/send-resetotp", {email})
    
  if(data.success){
    toast.success(data.message)
    setIsEmailSent(true)

  }else{
    toast.error(data.message)
  }

  }catch(error){
       toast.error(error.message)
  }
}


const onSubmitOtp= async (e)=>{
   e.preventDefault();
   try{
   console.log('otp is checking');
   const otpValue=otp.join("");

   const {data} = await axios.post(backendUrl+"/auth/verify-resetotp", {email,otp:otpValue})

  if( data.success){
  toast.success(data.message)
  setOtp(otpValue)
  setIsOtpSubmit(true)

}else{
  toast.error(data.message)
}
 
   
  }catch(error){
  console.log(error.message);
  toast.error(error.message)
  

  }
   
  
   
  
}
 const onSubmitNewPass= async (e)=>{
   e.preventDefault();
   try{

const {data}= await axios.post(backendUrl+"/auth/resetpassword",
  {
    email,
    otp,
    newPassword: newPassword
  }
);
if(data.success){
   toast.success(data.message)
   navigate("/login")

}else{
  toast.error(data.message)
}

}catch(error){
  console.log(error.response?.data);
    toast.error(
      error.response?.data?.message || "Something went wrong"
    );
}
}
  return (
  <div  className='flex  items-center  justify-center min-h-screen bg-linear-to-b from-blue-200 to bg-purple-400  '>
    
    <img  onClick={()=>{navigate("/")}}
    className="absolute left-5 sm:left-20 top-5 w-28  sm:w-32 cursor-pointer"

    src={assets.logo} alt="logo image" />


    {/*email enter  to reet pass*/}

    {!isEmailSent  && 
    <form  onSubmit={OnSubmitEmail} className='flex flex-col text-white text-center p-10 text-sm bg-slate-800 rounded-2xl'>
     <h1 className='text-2xl font-semibold mb-3'>Reset Password</h1>
    <p className='mb-4 text-center text-indigo-200'>Enter your regidtered email address</p>

     <div className="mb-3 flex items-center gap-3 w-90 px-8 py-3 rounded-full  bg-gray-700">
              <img src={assets.mail_icon} alt="" />
              <input
                 onChange={(e) =>
                   setEmail( e.target.value )
                 }
                className="  bg-transparent outline-none text-[rgb(248,249,249)] "
                type="email"
                value={email}
                name="email"
                placeholder="Enter Email Id"
                required
              />
            </div>
     <button className='w-full mt-3 py-3 px-2 rounded-2xl text-white bg-linear-to-r from-indigo-500 to-indigo-700 font-medium '
    >Submit</button> 
    </form>
}

  {/*enter a otp to reset pass*/}
   {  !isOtpSubmit &&  isEmailSent  && 
       <form   onSubmit={onSubmitOtp}
        className=" bg-slate-900 p-10 text-gray-200  rounded-xl shadow-lg text-sm" >
                     <img src={assets.otpimg} alt="" />
                     <h1 className='text-3xl font-semibold mb-3'> Reset Password OTP</h1>
                     <p className='mb-4'>Enter a 6_digit  code sent  to  email  example@gmail.com</p>
     
                     <div  onPaste={handlepaste}
                     className='flex justify-between mb-4'>
                       { 
                       Array(6).fill(0).map((_,index)=>(
                       <input 
                       key={index}
                        type="text" 
                         maxLength='1'
                          required
                          value={otp[index]}
                          ref={e=>(inputRefs.current[index]=e)}
                          onInput={(e)=>handleinputOtp(e,index)}
                          onKeyDown={(e)=>clearOtpfield(e,index)}
                       className='w-12 h-12   text-white bg-gray-700 text-xl text-center rounded-2xl  '
                       />
                       ))
                       }
                     </div>
                     <p className='mb-5 text-indigo-50'>Dont receive a code?{" "} <span className='text-indigo-300'>Resend OTP</span></p>
                     <button type="submit"  className='w-full  py-3 px-2 rounded-2xl text-white bg-linear-to-r from-indigo-500 to-indigo-700 font-medium'>Verify OTP</button>
             </form>
}

             {/* re-create  new password  */}
       {   isOtpSubmit && isEmailSent &&

       <form  onSubmit={onSubmitNewPass}
       className='flex flex-col text-white text-center p-10 text-sm bg-slate-800 rounded-2xl'>
     <h1 className='text-2xl font-semibold mb-3'>Reset Old Password</h1>
    <p className='mb-4 text-center text-indigo-200'>Enter password for your  regidtered email address</p>

     <div className="mb-3 flex items-center gap-3 w-90 px-8 py-3 rounded-full  bg-gray-700">
              <img src={assets.lock_icon} alt="" />
              <input
                 onChange={(e) =>
                   setNewPassword( e.target.value )
                 }
                className="  bg-transparent outline-none text-[rgb(248,249,249)] "
                type="password"
                value={newPassword}
                name="newpassword"
                placeholder="Enter new password"
                required
              />
            </div>
     <button className='w-full mt-3 py-3 px-2 rounded-2xl text-white bg-linear-to-r from-indigo-500 to-indigo-700 font-medium '
    >Submit New Password</button> 
    </form>
}


   </div>
  )
}

export default ResetPassword
