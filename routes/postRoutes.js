// post-related routes
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Create a post
router.post('/api/posts', postController.createPost);

// Fetch posts for a user and their friends
router.get('/api/posts', postController.fetchPosts);

// Add a comment to a post
router.post('/api/posts/:postId/comments', postController.addComment);

module.exports = router;