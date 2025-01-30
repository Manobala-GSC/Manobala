import Blog from '../models/blogModel.js';
import User from '../models/usermodel.js';

export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find()
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
        .then(blogs => blogs.map(blog => ({
          ...blog,
          previewContent: blog.previewContent || blog.content.replace(/<img[^>]*>/g, '')
        }))),
      Blog.countDocuments()
    ]);

    res.json({
      success: true,
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + blogs.length < total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find({ author: req.body.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
        .then(blogs => blogs.map(blog => ({
          ...blog,
          previewContent: blog.previewContent || blog.content.replace(/<img[^>]*>/g, '')
        }))),
      Blog.countDocuments({ author: req.body.userId })
    ]);

    res.json({
      success: true,
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + blogs.length < total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const previewContent = content.replace(/<img[^>]*>/g, '');

    const blog = new Blog({
      title,
      content,
      previewContent,
      tags,
      author: req.body.userId
    });

    await blog.save();
    res.json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, content, tags } = req.body;
    const previewContent = content.replace(/<img[^>]*>/g, '');
    
    const blog = await Blog.findOne({
      _id: blogId,
      author: req.body.userId
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found or unauthorized'
      });
    }
    
    blog.title = title;
    blog.content = content;
    blog.previewContent = previewContent;
    blog.tags = tags;
    blog.updatedAt = Date.now();
    
    await blog.save();
    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findOneAndDelete({
      _id: blogId,
      author: req.body.userId
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found or unauthorized'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const searchBlogs = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    
    const blogs = await Blog.find({
      $or: [
        { tags: { $regex: searchTerm, $options: 'i' } },
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate('author', 'name').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};