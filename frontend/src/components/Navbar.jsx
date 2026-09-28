import React, { useContext, useEffect } from 'react'
import {assets} from "../assets/assets.js"
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContex.jsx';
import axios  from 'axios';
import { toast } from 'react-toastify';

function Navbar() {

   const navigate = useNavigate();
   const {userData,backendUrl,setUserData,isLoggedIn, setIsLoggedIn} = useContext(AppContext);
   const{username,email,isAccountVerify}= userData;

const handleLogout= async ()=>{
  try{
    const {data}=  await axios.post(backendUrl+"/auth/logout",{},{  withCredentials: true})
    console.log(data);
    
    if(!data.success){
        toast.error(data.message)

    }
    
    setIsLoggedIn(false);
    setUserData(false);
    navigate("/")
    toast.success(data.message)

    

  }catch(error){
  toast.error(error.message)
  }
}

const sentVerifyOtp= async ()=>{
  try{
       const {data} = await axios.post(backendUrl+"/auth/sent-verify-otp",{},{ withCredentials: true})
       if(data.success){
         navigate("/emailverify");
         toast.success(data.message)


       }else{

         toast.error(data.message)
       }
  }catch{
     toast.error(error.message)
  }
}

const handleEmailVerify= async ()=>{
  try{
    const {data}=  await axios.post(backendUrl+"/auth/logout",{},{withCredentials: true})
    console.log(data);
    
    if(!data.success){
        toast.error(data.message)

    }
    
    setIsLoggedIn(false);
    setUserData(false);
    navigate("/")
    toast.success(data.message)

    

  }catch(error){
  toast.error(error.message)
  }
}



  return (
    <>
    <nav className='flex w-full justify-between items-center p-5 sm:p-4 sm:px-24 absolute top-0   '>
      
        <img src={assets.logo} alt="website logo auth logo" />
      {userData ?
  <div className='flex  justify-center items-center   gap-4 relative group  '>
    <div className= ' text-gray-300 flex  items-center justify-center w-10 h-10  bg-sky-700 rounded-full '>
      {(username[0]+ username[username.length-1]+" ").toUpperCase()} 
      </div >
      <div className=" hidden  absolute group-hover:block top-0 right-0 z-10 text-black rounded pt-10 w-30 ">
<       ul className='list-none m-0 p-2 bg-gray-100 text-sm '>
        { ! isAccountVerify &&
         <li onClick={sentVerifyOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email </li>
        } 
          <li onClick={handleLogout}  className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Logout</li>
        </ul>

      </div>
    
  </div>
  
    
  :  
  <button  onClick={()=>navigate("/login")}
      className='flex items-center gap-2 border border-gray-500 rounded-full px-5 py-2 text-gray-600  hover:bg-gray-100 transition-all'>
        Login 
      <img className='' src={assets.arrow_icon} alt="login arrow icon" /></button>

  }
       
    </nav>
   
   
    </>
  )
}

export default Navbar
