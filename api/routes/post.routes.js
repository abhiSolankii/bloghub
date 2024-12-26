import express from "express";
import {
  getPosts,
  createPost,
  generateAnswer,
  deletePost,
  updatePost,
} from "../controllers/post.controller.js";
import VerifyToken from "../utils/VerifyToken.js";

const router = express.Router();

// Route to get all posts
router.get("/getposts", getPosts);

// Route to create a post with image upload (multer middleware added here)
router.post("/createPost", VerifyToken, createPost);
router.delete("/deletepostbyid/:postId/:userId", VerifyToken, deletePost);
router.put("/updatepostbyid/:postId/:userId", VerifyToken, updatePost);
router.post("/generate-answer", VerifyToken, generateAnswer);

export default router;
