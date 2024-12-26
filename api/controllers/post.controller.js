import axios from "axios";
import mongoose from "mongoose";
import Post from "../models/post.model.js";
import slugify from "slugify";
import User from "../models/user.model.js";

//create post
export const createPost = async (req, res) => {
  const userId = req.user.id; // Assuming req.user is populated after authentication
  const { title, content, category, author, image } = req.body;

  // Check if all required fields are provided
  if (!title || !content || !category || !author || !image) {
    return res
      .status(400)
      .json({ message: "Please fill all the required fields." });
  }

  // Validate title and content length
  if (title.length < 20 || content.length < 50) {
    return res.status(400).json({
      message:
        "Title should be at least 20 characters and content should be at least 50 characters.",
    });
  }

  try {
    // Generate a unique slug from the title
    const slug = slugify(title, { lower: true });

    // Check if a post with the same slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res
        .status(400)
        .json({ message: "A post with this title already exists." });
    }

    // Create a new post
    const newPost = new Post({
      title,
      content,
      category,
      userId,
      image: image, // Use the imageUrl from frontend
      slug,
      author,
    });

    // Save the new post to the database
    await newPost.save();

    // Check if user exists and push id of new post into user posts section
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.posts.push(newPost._id);
    await user.save(); // Save the updated user

    // Respond with the newly created post
    res.status(201).json({
      message: "Post created successfully.",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};
// Fetch all posts
export const getPosts = async (req, res, next) => {
  const startIndex = req.query.startIndex || 0;
  const limit = req.query.limit || 8;
  const sortDirection = req.query.order === "asc" ? 1 : -1;
  const now = new Date();

  try {
    const queryFilters = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchInput && {
        $or: [
          { title: { $regex: req.query.searchInput, $options: "i" } },
          { category: { $regex: req.query.searchInput, $options: "i" } },
          { content: { $regex: req.query.searchInput, $options: "i" } },
        ],
      }),
    };

    const posts = await Post.find(queryFilters)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate("userId");
    // Total posts
    const totalPosts = await Post.countDocuments(queryFilters);

    // One month ago posts
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

export const deletePost = async (req, res) => {
  const isAuthorized = req.user.id === req.params.userId;
  if (!isAuthorized)
    return res
      .status(403)
      .send({ message: "You are not authorized to delete this post." });
  const postId = req.params.postId;
  try {
    await Post.findByIdAndDelete(postId);
    res.status(200).send({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post.", error });
  }
};

export const updatePost = async (req, res) => {
  const isAuthorized = req.user.id === req.params.userId;
  if (!isAuthorized)
    return res
      .status(403)
      .send({ message: "You are not authorized to update this post." });

  const postId = req.params.postId;
  const { title, content, category, author, image } = req.body;

  // Check if all required fields are provided
  if (!title || !content || !category || !author || !image) {
    return res
      .status(400)
      .json({ message: "Please fill all the required fields." });
  }

  // Validate title and content length
  if (title.length < 20 || content.length < 50) {
    return res.status(400).json({
      message:
        "Title should be at least 20 characters and content should be at least 50 characters.",
    });
  }

  try {
    let slug;
    // Generate a unique slug only if the title has changed
    const post = await Post.findById(postId);
    if (post.title !== title) {
      slug = slugify(title, { lower: true });
      const existingPost = await Post.findOne({ slug });
      if (existingPost) {
        return res
          .status(400)
          .json({ message: "A post with this title already exists." });
      }
    }

    const data = {
      title,
      content,
      category,
      author,
      image,
      ...(slug && { slug }),
    };
    const updatedPost = await Post.findByIdAndUpdate(postId, data, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Post updated successfully.", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post.", error });
  }
};

export const generateAnswer = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  const data = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_AI_API_KEY}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error communicating with Gemini AI:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
