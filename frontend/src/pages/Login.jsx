import { useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContex";
import { toast } from "react-toastify";

const Login = () => {
  const navigates = useNavigate();
const {backendUrl, setIsLoggedIn, getUserData } =useContext(AppContext); 


  const [loginState, setLoginState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    username: "",
    email: "@gmail.com",
    password: "",
  });

  const loginHandle = () => {
    console.log("login form open");

    setLoginState((prev) => (prev = "login"));
  };
  const signUpHandle = () => {
    console.log("registrartion / sighUo form open");

    setLoginState((prev) => (prev = "Sign Up"));
  };
   axios.defaults.withCredentials= true;

  const onSubmitHandle= async (e)=>{
    try{
      e.preventDefault();
     
      if(loginState==="Sign Up"){
        const {data}= await axios.post(backendUrl+"/auth/register", {
          username:formData.username,
          email:formData.email,
          password: formData.password},
        {
            withCredentials: true
        }
        );
          
console.log(data);

        if(data.success){
          setIsLoggedIn(true);
          getUserData();
          navigates("/")
        }else{
          //alert(data.message)
          toast.error(data.message)
        }
      }
      else{
         const  {data}= await axios.post(backendUrl+"/auth/login", {
          email:formData.email,
          password:formData.password},{
              withCredentials: true
          });
console.log(data);

        if(data.success){
          setIsLoggedIn(true);
          getUserData();
          navigates("/")
        }else{
          //alert(data.message)
          toast.error(data.message)
        }
    

      }



    }catch (error) {
    console.log(error.response?.data);

    toast.error(
        error.response?.data?.message || "Something went wrong"
    );
}

  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-6 sm:p-0 bg-linear-to-b from-blue-200 to bg-purple-400  ">
        <img
          onClick={() => navigates("/")}
          className="absolute left-5 sm:left-20 top-5 w-28  sm:w-32 cursor-pointer"
          src={assets.logo}
          alt="email icon of login page"
        />
        <div className=" w-full sm:w-96  p-10 rounded-lg shadow-lg text-sm  text-indigo-300  bg-slate-800 ">
          <h2 className="text-center  text-3xl font-semibold text-white mb-3">
            {loginState === "Sign Up" ? "Create Acount " : "Login"}
          </h2>
          <p className="text-white text-center text-sm mb-6">
            {loginState === "Sign Up"
              ? "Create your Acount "
              : "Login To your Account!"}
          </p>
          <form  onSubmit={onSubmitHandle}>
            {loginState === "Sign Up" && (
              <div className="mb-3 flex items-center gap-3 w-full px-8 py-3 rounded-full  bg-gray-700">
                <img src={assets.person_icon} alt="" />
                <input
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className=" bg-transparent outline-none text-[rgb(248,249,249)] "
                  type="text"
                  value={formData.username}
                  name="username"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}
            <div className="mb-3 flex items-center gap-3 w-full px-8 py-3 rounded-full  bg-gray-700">
              <img src={assets.mail_icon} alt="" />
              <input
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className=" bg-transparent outline-none text-[rgb(248,249,249)] "
                type="email"
                value={formData.email}
                name="email"
                placeholder="Enter Email Id"
                required
              />
            </div>
            <div className="mb-3 flex items-center gap-3 w-full px-8 py-3 rounded-full  bg-gray-700">
              <img src={assets.lock_icon} alt="" />
              <input
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className=" bg-transparent outline-none text-[rgb(248,249,249)] "
                type="password"
                value={formData.password}
                name="password"
                placeholder="enter password "
                required
              />
            </div>
            <p
              onClick={() => navigates("/reset-pass")}
              className="cursor-pointer mb-4 text-indigo-500 "
            >
              Forget Password?{" "}
            </p>

            <button className="w-full py-3 rounded-full text-white bg-linear-to-r from-indigo-500 to-indigo-900 font-medium ">
              {loginState}
            </button>
          </form>

          {loginState === "Sign Up" && (
            <p className="text-center mt-2 text-gray-400  text-xs ">
              Already Have an Account?{" "}
              <span
                onClick={loginHandle}
                className=" underline text-blue-500 cursor-pointer "
              >
                Login here{" "}
              </span>
            </p>
          )}
          {loginState === "login" && (
            <p className="text-center mt-2 text-gray-400  text-xs ">
              Create New Account?{" "}
              <span
                onClick={signUpHandle}
                className=" underline text-blue-500 cursor-pointer "
              >
                Sign Up here
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
