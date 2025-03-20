import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Navbar({ stayOnPage = false }) {
  const navigate = useNavigate();
  const {userData,backendUrl,setUserData,setIsLoggedin} = useContext(AppContent);

  const handleNavigation = (path) => {
    console.log('Navbar navigation clicked:', path);
    navigate(path);
  };

  const logout = async() => {
    try{
      const {data} = await axios.post(`${backendUrl}/api/auth/logout`, {}, {
        withCredentials: true
      });
      if(data.success){
        setIsLoggedin(false);
        setUserData(null);
        if (!stayOnPage) {
          navigate('/');
        }
      }
    }
    catch(error){
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  }

  const sendverificationotp = async() => {
    try{
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(`${backendUrl}/api/auth/sendOtp`);
      if(data.success){
        navigate('/emailVerify')
        toast.success(data.message);
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.response.data.message)
    }
  }

  return (
    <nav className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 bg-white/80 backdrop-blur-sm fixed top-0 z-50'>
        <div className="flex items-center gap-6">
            <a href="/" onClick={(e) => { 
              e.preventDefault(); 
              console.log('Home link clicked');
              handleNavigation('/'); 
            }}>
                <img src={assets.logo} className='w-28 sm:32' alt="Logo"/>
            </a>
            <button onClick={() => handleNavigation('/blogs')} className="text-gray-800 hover:text-gray-600">Blogs</button>
            <button onClick={() => handleNavigation('/about')} className="text-gray-800 hover:text-gray-600">About</button>
            <button onClick={() => handleNavigation('/resources')} className="text-gray-800 hover:text-gray-600">Resources</button>
            <button onClick={() => handleNavigation('/forum')} className="text-gray-800 hover:text-gray-600">Forum</button>
            <button onClick={() => handleNavigation('/contact')} className="text-gray-800 hover:text-gray-600">Contact</button>
            <button onClick={() => {
              console.log('Chatbot clicked');
              if (!userData) {
                toast.info('Please login to use the chatbot');
                handleNavigation('/login');
              } else {
                handleNavigation('/chatbot');
              }
            }} className="text-gray-800 hover:text-gray-600">Chatbot</button>
            <button onClick={() => {
              console.log('Expert chat clicked');
              if (!userData) {
                toast.info('Please login to access expert chat');
                handleNavigation('/login');
              } else {
                handleNavigation('/expert-chat');
              }
            }} className="text-gray-800 hover:text-gray-600">Expert Chat</button>
            {userData && userData.email === 'gscteam12345@gmail.com' && (
                <button 
                    onClick={() => handleNavigation('/admin')} 
                    className="text-gray-800 hover:text-gray-600"
                >
                    Admin Dashboard
                </button>
            )}
        </div>
        {userData? <div className="w-8 h-8 flex justify-center items-center rounded-full text-white bg-black relative group ">
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden 
            group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                {!userData.isAccountVerified && <li onClick={sendverificationotp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li>}
                <li onClick={() => handleNavigation('/my-blogs')} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">My Blogs</li>
                <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
              </ul>
          </div>
        </div>
        :
        <button onClick={()=>handleNavigation('/login')} className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">Login <img src={assets.arrow_icon}/></button>}
    </nav>
  )
}

export default Navbar