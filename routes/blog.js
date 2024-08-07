const express = require('express');
const blogController = require('../controllers/blog');
const auth = require('../auth');
const { verify, verifyAdmin, notAdmin } = auth;

const router = express.Router();

router.post('/posts', verify, notAdmin, blogController.createBlog);
router.patch('/posts/:blogId', verify, notAdmin, blogController.updateBlog);
router.delete('/posts/:blogId', verify, blogController.deleteBlog);
router.get('/posts', blogController.getBlogs);
router.get('/posts/:blogId', verify, blogController.getBlogById);
router.post('/posts/:blogId/comments', verify, notAdmin, blogController.addComment);
router.delete('/posts/:blogId/comments/:commentId', verify, blogController.deleteComment);
router.get('/posts/:blogId/comments', blogController.getComments);
module.exports = router;
