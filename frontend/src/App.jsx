import React from 'react'
import { Routes,Route } from 'react-router-dom'
import "./App.css"
import "./index.css"
import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <>
     <ToastContainer/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/reset-pass" element={<ResetPassword/>} />
      <Route path="/emailverify" element={<VerifyEmail/>} />

    </Routes>
   
    </>
  )
}

export default App
