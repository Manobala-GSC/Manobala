import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


function Navbar({ stayOnPage = false }) {
  const navigate=useNavigate();
  const {userData,backendUrl,setUserData,setIsLoggedin}=useContext(AppContent);
  const logout=async()=>{
    try{
      const {data}=await axios.post(`${backendUrl}/api/auth/logout`, {}, {
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

  const sendverificationotp=async(req,res)=>{
    try{
      axios.defaults.withCredentials = true;
      const {data}=await axios.post(`${backendUrl}/api/auth/sendOtp`);
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
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        <div className="flex items-center gap-6">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                <img src={assets.logo} className='w-28 sm:32'/>
            </a>
            <button onClick={() => navigate('/blogs')} className="text-gray-800 hover:text-gray-600">Blogs</button>
            <button onClick={() => navigate('/about')} className="text-gray-800 hover:text-gray-600">About</button>
            <button onClick={() => navigate('/resources')} className="text-gray-800 hover:text-gray-600">Resources</button>
            <button onClick={() => navigate('/forum')} className="text-gray-800 hover:text-gray-600">Forum</button>
            <button onClick={() => navigate('/contact')} className="text-gray-800 hover:text-gray-600">Contact</button>
            <button onClick={() => {
              if (!userData) {
                toast.info('Please login to use the chatbot');
                navigate('/login');
              } else {
                navigate('/chatbot');
              }
            }} className="text-gray-800 hover:text-gray-600">Chatbot</button>
        </div>
        {userData? <div className="w-8 h-8 flex justify-center items-center rounded-full text-white bg-black relative group ">
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden 
            group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                {!userData.isAccountVerified && <li onClick={sendverificationotp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify Email</li>}
                <li onClick={() => navigate('/my-blogs')} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">My Blogs</li>
                <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
              </ul>
          </div>
        </div>
        :
        <button onClick={()=>navigate('/login')} className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">Login <img src={assets.arrow_icon}/></button>}
    </div>
  )
}

export default Navbar