import React, { useState, useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContex';
import axios from 'axios';
import { toast } from 'react-toastify';
function VerifyEmail() {
const navigate= useNavigate();

const {backendUrl,isLoggedIn,setIsLoggedIn ,userData, getUserData}= useContext(AppContext)

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

const {data} = await axios.post(backendUrl+"/auth/emailverify", {otp:otpValue})

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
useEffect(()=>{
  isLoggedIn && userData && userData.isAccountVerify &&  navigate("/")

},[isLoggedIn,userData]);



  return (
    <div className='  min-h-screen px-6 sm:p-0 bg-linear-to-b from-blue-200 to bg-purple-400'>
      <img  onClick={()=>navigate("/")}
      className='absolute left-5 sm:left-20 top-5 w-28  sm:w-32 cursor-pointer' src={assets.logo} alt="logo" />


    <div className='flex  flex-col text-center items-center justify-center w-full h-screen'>
        <form  className=" bg-slate-900 p-10 text-gray-200  rounded-xl shadow-lg text-sm" >
                <img src={assets.otpimg} alt="" />
                <h1 className='text-3xl font-semibold mb-3'>Verify OTP</h1>
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
                <button onClick={handleOtpSubmit} className='w-full  py-3 px-2 rounded-2xl text-white bg-linear-to-r from-indigo-500 to-indigo-700 font-medium'>Verify OTP</button>
        </form>
    </div>
    </div>
  )
}

export default VerifyEmail
