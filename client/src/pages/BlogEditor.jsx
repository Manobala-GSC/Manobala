import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function BlogEditor() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const handleSave = async () => {
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // Create a preview version without images for card display
      const previewContent = content.replace(/<img[^>]*>/g, '');
      
      const endpoint = blogId 
        ? `${backendUrl}/api/blogs/${blogId}`
        : `${backendUrl}/api/blogs`;
      
      const method = blogId ? 'put' : 'post';
      
      const { data } = await axios[method](
        endpoint,
        { 
          title, 
          content,
          previewContent, // Add preview content
          tags: tagsArray 
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(blogId ? 'Blog updated!' : 'Blog created!');
        navigate('/my-blogs');
      }
    } catch (error) {
      toast.error('Error saving blog');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="bg-white rounded-lg shadow-md p-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog Title"
            className="w-full text-2xl font-bold mb-4 p-2 border rounded"
          />
          
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className="w-full mb-4 p-2 border rounded"
          />

          <div className="mb-4">
            <ReactQuill 
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="h-96 mb-12"
            />
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => navigate('/my-blogs')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {blogId ? 'Update' : 'Publish'} Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogEditor; 