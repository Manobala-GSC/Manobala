import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { format } from 'date-fns';

function BlogView() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/blogs/${blogId}`, {
          withCredentials: true
        });
        if (data.success) {
          setBlog(data.blog);
        }
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching blog');
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  useEffect(() => {
    const lazyLoadImages = () => {
      const blogContent = document.querySelector('.blog-content');
      if (!blogContent) return;

      const images = blogContent.getElementsByTagName('img');
      
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      });

      Array.from(images).forEach(img => {
        if (img.src !== img.dataset.src) {
          imageObserver.observe(img);
        }
      });
    };

    if (blog) {
      // Replace image src with data-src for lazy loading
      const contentWithLazyImages = blog.content.replace(
        /<img([^>]*)src="([^"]*)"([^>]*)>/g,
        '<img$1data-src="$2"$3src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">'
      );
      
      const blogContentElement = document.querySelector('.blog-content');
      if (blogContentElement) {
        blogContentElement.innerHTML = contentWithLazyImages;
        lazyLoadImages();
      }
    }
  }, [blog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center">Blog not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <article className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-6">
            <span className="mr-4">
              {format(new Date(blog.createdAt), 'MMM d, yyyy')}
            </span>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex gap-2">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div 
            className="prose max-w-none blog-content"
          />
        </article>
      </div>
    </div>
  );
}

export default BlogView; 