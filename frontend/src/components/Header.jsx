import React from 'react'
import { assets } from '../assets/assets'
import { useContext } from "react";
import { AppContext } from '../context/AppContex'

function Header() {
 const {userData} = useContext(AppContext);
   console.log(userData)

  return (
    <div className='flex flex-col  items-center mt-24 px-4  text-center text-gray-800 '>
      <img src={assets.header_img} alt="header image "
      className='w-32 h-32 rounded-full mb-6 '
      /> 
      <h1 className=
      'flex  items-center gap-2 text-xl sm:text-3xl  font-medium mb-2 '>
        Hey { userData ? userData.username  : "Developer"} 
        <img className='w-8 aspect-square' src={assets.hand_wave} alt="" /></h1>
     <h2 className='text-3xl sm:text-5xl  font-semibold mb-4 '>Welcome to our Page </h2>
     <p className='mb-8 max-w-md'>lets check our login logout  along ith otp   email verfifcation and password  reset  demo</p>
     <button className='border py-2 px-6  border-gray-400  rounded-full hover:bg-gray-100 transition-all '>
         Get Started</button>
    </div>
  )
}

export default Header
