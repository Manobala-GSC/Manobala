import express from 'express';
import { 
  getAllBlogs,
  getMyBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogs
} from '../controllers/blogController.js';
import userAuth from '../middleware/userAuth.js';
import Blog from '../models/blogModel.js';

const blogRouter = express.Router();

// Search route should be before dynamic routes
blogRouter.get('/search', searchBlogs);

// Protected routes with specific paths
blogRouter.get('/my-blogs', userAuth, getMyBlogs);

// CRUD operations
blogRouter.get('/', userAuth, getAllBlogs);
blogRouter.post('/', userAuth, createBlog);
blogRouter.put('/:blogId', userAuth, updateBlog);
blogRouter.delete('/:blogId', userAuth, deleteBlog);

// Single blog route should be last as it's a catch-all
blogRouter.get('/:blogId', userAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId)
      .populate('author', 'name');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default blogRouter; 