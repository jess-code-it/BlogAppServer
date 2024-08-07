const Blog = require('../models/Blog');
const { errorHandler } = require('../auth');

// Function to create a new Blog
module.exports.createBlog = async (req, res) => {
  try {
    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id
    });

    const savedBlog = await newBlog.save();
    res.status(201).send({ message: 'Blog created successfully', blog: savedBlog });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Function to update a Blog
module.exports.updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, content } = req.body;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).send({ message: 'Blog not found' });
    }

    if (!req.user || !req.user.id) {
      return res.status(400).send({ message: 'Invalid user' });
    }

    if (blog.author.toString() !== req.user.id.toString()) {
      return res.status(403).send({ message: 'You are not authorized to update this blog' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    const updatedBlog = await blog.save();
    res.status(200).send({ success: true, blog: updatedBlog });
  } catch (error) {
    errorHandler(error, req, res);
  }
};


// Function to delete a Blog
module.exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).send({ message: 'Blog not found' });
    }

    if (blog.author.toString() === req.user.id.toString() || req.user.isAdmin === true) {
      await Blog.deleteOne({ _id: blogId });
      res.status(200).send({ message: 'Blog deleted successfully' });
    } else {
      return res.status(403).send({ message: 'You are not authorized to delete this blog' });
    }
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Function to get all Blogs
module.exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username email').populate('comments.author', 'username email');
    res.status(200).send({ blogs });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Function to get a Blog by ID
module.exports.getBlogById = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId).populate('author', 'username email').populate('comments.author', 'username email');

    if (!blog) {
      return res.status(404).send({ message: 'Blog not found' });
    }

    res.status(200).send({ blog });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Function to add a comment to a Blog
module.exports.addComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { content } = req.body;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).send({ message: 'Blog not found' });
    }

    // Create a new comment object
    const newComment = {
      content,
      author: req.user.id
    };

    // Add the new comment to the blog's comments array
    blog.comments.push(newComment);

    // Save the updated blog
    const updatedBlog = await blog.save();

    // Find the added comment in the updated blog's comments
    const addedComment = updatedBlog.comments.find(comment => 
      comment.content === newComment.content && comment.author.toString() === req.user.id
    );

    // Return the success message and the added comment
    res.status(201).send({
      message: 'Comment added successfully',
      comment: addedComment
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Function to delete a comment
module.exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findOne({ _id: blogId, 'comments._id': commentId });

    if (!blog) {
      return res.status(404).send({ message: 'Blog or comment not found' });
    }

    const comment = blog.comments.id(commentId);

    if (!comment) {
      return res.status(404).send({ message: 'Comment not found' });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).send({ message: 'User not authenticated' });
    }

    if (comment.author.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      return res.status(403).send({ message: 'You are not authorized to delete this comment' });
    }

    // Remove the comment manually
    blog.comments = blog.comments.filter(c => c._id.toString() !== commentId);

    // Save the updated blog
    await blog.save();
    res.status(200).send({ message: 'Comment deleted successfully' });
  } catch (error) {
    errorHandler(error, req, res);
  }
};


// Function to get all comments for a Blog
module.exports.getComments = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId).populate('comments.author', 'username email');

    if (!blog) {
      return res.status(404).send({ message: 'Blog not found' });
    }

    res.status(200).send({ comments: blog.comments });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
