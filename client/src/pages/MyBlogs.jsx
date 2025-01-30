import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { format } from 'date-fns';

function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });

  const { isLoggedin, backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

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

  const fetchMyBlogs = async (pageNum) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/blogs/my-blogs?page=${pageNum}&limit=9`, {
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
          setPage(1);
          fetchMyBlogs(1);
        }
      } catch (error) {
        navigate('/login');
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingBlog
        ? `http://localhost:8000/api/blogs/${editingBlog._id}`
        : 'http://localhost:8000/api/blogs';

      const method = editingBlog ? 'put' : 'post';
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const { data } = await axios[method](endpoint,
        { ...formData, tags: tagsArray },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(editingBlog ? 'Blog updated!' : 'Blog created!');
        fetchMyBlogs();
        setShowCreateModal(false);
        setEditingBlog(null);
        setFormData({ title: '', content: '', tags: '' });
      }
    } catch (error) {
      toast.error('Error saving blog');
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const { data } = await axios.delete(`${backendUrl}/api/blogs/${blogId}`, {
        withCredentials: true
      });

      if (data.success) {
        toast.success('Blog deleted successfully');
        // Update the blogs state by filtering out the deleted blog
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
      }
    } catch (error) {
      toast.error('Error deleting blog');
    }
  };

  const truncateContent = (content) => {
    if (!content) return '';
    const plainText = (content.previewContent || content.content || '')
      .replace(/<[^>]+>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Blogs</h1>
          <button
            onClick={() => navigate('/blog/new')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Write Blog
          </button>
        </div>

        {initialLoad ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Use index for loading skeleton keys */}
            {[1, 2, 3].map((_, index) => (
              <div key={`skeleton-${index}`} className="animate-pulse bg-white rounded-lg shadow-md p-6">
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
                key={`${blog._id}-${index}`}
                ref={blogs.length === index + 1 ? lastBlogElementRef : null}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition duration-200 hover:scale-105"
              >
                <div 
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  className="cursor-pointer"
                >
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                    {blog.title}
                  </h2>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {truncateContent(blog)}
                  </p>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag, tagIndex) => (
                        <span
                          key={`${blog._id}-tag-${tagIndex}`}
                          className="bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/blog/edit/${blog._id}`);
                    }}
                    className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(blog._id);
                    }}
                    className="text-red-500 hover:text-red-700 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {loading && !initialLoad && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full border rounded-lg p-2 h-40"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full border rounded-lg p-2"
                    placeholder="tech, programming, web"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingBlog(null);
                      setFormData({ title: '', content: '', tags: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    {editingBlog ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBlogs; 