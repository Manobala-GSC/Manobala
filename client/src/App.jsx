import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/EmailVerify";
import ChatBot from "./pages/ChatBot";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyBlogs from "./pages/MyBlogs";
import AllBlogs from "./pages/AllBlogs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import BlogEditor from "./pages/BlogEditor";
import BlogView from './pages/BlogView';


const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/emailVerify" element={<EmailVerify />} />
      <Route path="/chatbot" element={<ChatBot />} />
      <Route path="/blogs" element={<AllBlogs/>} />
      <Route path="/my-blogs" element={<MyBlogs />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/blog/new" element={<BlogEditor />} />
      <Route path="/blog/edit/:blogId" element={<BlogEditor />} />
      <Route path="/blog/:blogId" element={<BlogView />} />
    </>
    )
  );
  
  export default router;