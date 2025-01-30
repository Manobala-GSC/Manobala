import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { AppContent } from '../context/AppContext';
import { format } from 'date-fns';

function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);
  
  // Create a ref for the intersection observer
  const observer = useRef();
  const lastBlogElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchBlogs = async (pageNum) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/blogs?page=${pageNum}&limit=9`, {
        withCredentials: true
      });
      
      if (data.success) {
        if (pageNum === 1) {
          setBlogs(data.blogs);
        } else {
          setBlogs(prev => [...prev, ...data.blogs]);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      toast.error('Error fetching blogs');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
          withCredentials: true
        });
        if (!data.success) {
          navigate('/login');
        } else {
          // Reset page and fetch initial blogs
          setPage(1);
          fetchBlogs(1);
        }
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();
  }, []); // Initial auth check and blog fetch

  const truncateContent = (content) => {
    if (!content) return ''; // Handle undefined content
    const plainText = (content.previewContent || content.content || '')
      .replace(/<[^>]+>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Blogs</h1>
          <button
            onClick={() => navigate('/blog/new')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Write Blog
          </button>
        </div>

        {initialLoad ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-white rounded-lg shadow-md p-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <div
                key={blog._id}
                ref={blogs.length === index + 1 ? lastBlogElementRef : null}
                onClick={() => navigate(`/blog/${blog._id}`)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition duration-200 hover:scale-105"
              >
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                  {blog.author?.name && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{blog.author.name}</span>
                    </>
                  )}
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {truncateContent(blog)}
                </p>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {loading && !initialLoad && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllBlogs;