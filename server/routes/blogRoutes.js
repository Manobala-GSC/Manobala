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

const blogRouter = express.Router();

// Public route
blogRouter.get('/', getAllBlogs);

// Protected routes
blogRouter.get('/my-blogs', userAuth, getMyBlogs);
blogRouter.post('/', userAuth, createBlog);
blogRouter.put('/:blogId', userAuth, updateBlog);
blogRouter.delete('/:blogId', userAuth, deleteBlog);
blogRouter.get('/search', searchBlogs);

export default blogRouter; 