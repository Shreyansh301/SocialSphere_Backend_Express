const Post = require('../models/Post');
const User = require('../models/User');

// Create a post
const createPost = async (req, res) => {
  const { content, author } = req.body;

  if (!content || !author) {
    return res.status(400).json({ error: "Content and author are required" });
  }

  try {
    const newPost = new Post({
      content,
      author,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

// Fetch posts for a user and their friends
const fetchPosts = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Fetch posts from the user and their friends
    const posts = await Post.find({ author: { $in: [username, ...user.friends] } })
      .sort({ createdAt: -1 }); // Sort by latest first

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { commenter, content } = req.body;

  if (!commenter || !content) {
    return res.status(400).json({ error: "Commenter and content are required" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({ commenter, content });
    await post.save();

    res.status(201).json({ message: "Comment added successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

module.exports = {
  createPost,
  fetchPosts,
  addComment,
};