import React, {createContext, useState,useEffect} from 'react';
import { toast } from "react-toastify";
import axios from "axios";
export const AppContext = createContext();

function CreateContextProvider(props) {
   axios.defaults.withCredentials= true;
    const backendUrl= import.meta.env.VITE_BACKEND_URL ;
    const [isLoggedIn,setIsLoggedIn]= useState(false);
    const [userData,setUserData]= useState(false);
  

    const getAuthState = async ()=>{
      try{
        const {data}= await axios.get(backendUrl+"/auth/isauth",{
          withCredentials:true
        });
        console.log(data);
        if(data.success){
          setIsLoggedIn(true);
          getUserData()
        }
      }catch(err){
        if(err.response?.status !==401){
          toast.error(
            err.response?.data?.message || err.message
          );
        }else{
          
        }
        
      }
    }

  const getUserData= async ()=>{
    try{
       const {data} = await axios.get(backendUrl+"/api/users/user",{  withCredentials: true})
       console.log(data);
       
   data.success ? setUserData(data.userData) : toast.error(data.message);
    }catch(error){
       toast.error(error.message)
    }
  }


   useEffect(()=>{
    getAuthState();

   },[])

    const value= {
    backendUrl,
    isLoggedIn,setIsLoggedIn,

    userData,setUserData,
    getUserData


  }

  return (
   <AppContext.Provider value={value} >
  {props.children}
   </AppContext.Provider>
  )
}

export default CreateContextProvider;
