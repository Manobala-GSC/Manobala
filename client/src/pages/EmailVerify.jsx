import React, { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets'
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';

function EmailVerify() {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent);
  const inputRefs = useRef([]);
  
  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index+1].focus();
    }
  }
  
  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index-1].focus();
    }
  }
  
  const handlePaste = (e) => {
    e.preventDefault();
    
    const paste = e.clipboardData.getData('text').split('');
    paste.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  }

  const onSubmithandler = async(e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')
      const { data } = await axios.post(`${backendUrl}/api/auth/verifyEmail`, { otp })
      if(data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message)
      }
    } catch(error) {
      toast.error(error.message)
    }
  }
  
  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedin, userData, navigate])
  
  return (
    <div className="flex items-center justify-center min-h-screen pattern-bg">
      <img 
        onClick={() => navigate('/')}
        src={assets.logo || "/placeholder.svg"} 
        alt="Logo" 
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" 
      />
      
      <div className="relative w-full sm:w-96 max-w-md mx-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light/20 to-primary-lighter/20 rounded-2xl blur-xl"></div>
        <form 
          onSubmit={onSubmithandler}
          className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft border border-card-border"
        >
          <h1 className="text-3xl font-bold text-gradient text-center mb-4">
            Email Verification
          </h1>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Enter the 6-digit code sent to your email
          </p>
          
          <div 
            className="flex justify-between mb-8 space-x-2" 
            onPaste={handlePaste}
          >
            {Array(6).fill(0).map((_, index) => (
              <input 
                type="text" 
                maxLength='1' 
                key={index} 
                required
                className="w-12 h-12 bg-primary-lighter/10 text-primary text-center text-xl rounded-lg border border-primary-lighter focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-all" 
                ref={(e) => {
                  inputRefs.current[index] = e
                }} 
                onInput={(e) => {handleInput(e, index)}} 
                onKeyDown={(e) => {handleKeyDown(e, index)}}
              />
            ))}
          </div>
          
          <button 
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl shadow-button hover:shadow-lg transition-all duration-300 transform hover:scale-102"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  )
}

export default EmailVerify
