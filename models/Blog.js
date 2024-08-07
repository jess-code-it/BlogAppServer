const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Comment content is required"]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Comment author is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Post title is required"],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Post content is required"]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, "Post author is required"]
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  comments: [commentSchema]
});

module.exports = mongoose.model('Post', blogSchema);
