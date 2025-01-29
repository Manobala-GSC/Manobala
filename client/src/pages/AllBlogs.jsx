import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { AppContent } from '../context/AppContext';


function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUrl } = useContext(AppContent);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/blogs`, {
        withCredentials: true
      });
      if (data.success) {
        setBlogs(data.blogs);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching blogs');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar stayOnPage={true} />
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8">All Blogs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {blog.author?.name || 'Unknown'}</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllBlogs; 