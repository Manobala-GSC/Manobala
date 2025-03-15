import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { format } from 'date-fns';
import BlogCard from '../components/blog/BlogCard';
import { Edit, Plus, Loader2 } from 'lucide-react';

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

  useEffect(() => {
    if (page > 1) {
      fetchMyBlogs(page);
    }
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingBlog
        ? `${backendUrl}/api/blogs/${editingBlog._id}`
        : `${backendUrl}/api/blogs`;

      const method = editingBlog ? 'put' : 'post';
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const { data } = await axios[method](endpoint,
        { ...formData, tags: tagsArray },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(editingBlog ? 'Blog updated!' : 'Blog created!');
        fetchMyBlogs(1);
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

  // Handle like updates
  const handleLikeUpdate = (blogId, liked, likeCount) => {
    setBlogs(prevBlogs => 
      prevBlogs.map(blog => 
        blog._id === blogId 
          ? { ...blog, likes: [...blog.likes] } // Create a new array to trigger re-render
          : blog
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Stories</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and edit your published content</p>
          </div>
          <button 
            onClick={() => navigate('/blog/new')} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Story
          </button>
        </div>

        {initialLoad ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={`skeleton-${index}`} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, index) => {
                if (blogs.length === index + 1 && hasMore) {
                  return (
                    <div ref={lastBlogElementRef} key={blog._id}>
                      <BlogCard blog={blog} onLikeUpdate={handleLikeUpdate} />
                    </div>
                  );
                } else {
                  return <BlogCard key={blog._id} blog={blog} onLikeUpdate={handleLikeUpdate} />;
                }
              })}
            </div>
            
            {loading && !initialLoad && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more stories
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">You haven't written any stories yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Start creating content and sharing your ideas with the world</p>
            <button 
              onClick={() => navigate('/blog/new')} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <Edit className="h-4 w-4" />
              Write your first story
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editingBlog ? 'Edit Blog' : 'Create New Blog'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 dark:bg-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 h-40 dark:bg-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 dark:bg-gray-900 dark:text-gray-100"
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
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {editingBlog ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBlogs;
