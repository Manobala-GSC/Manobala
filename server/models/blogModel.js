import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    get: function(data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return data;
      }
    },
    set: function(data) {
      return typeof data === 'string' ? data : JSON.stringify(data);
    }
  },
  previewContent: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add compound index for efficient sorting and filtering
blogSchema.index({ createdAt: -1, author: 1 });

// Add text index for search functionality
blogSchema.index({ title: 'text', previewContent: 'text', tags: 'text' });

export default mongoose.model('Blog', blogSchema);