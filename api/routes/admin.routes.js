import express from "express";
import {
  getUsers,
  getPosts,
  deleteUser,
  deletePost,
  makeOrRemoveAdmin,
} from "../controllers/admin.controller.js";
import VerifyAdminToken from "../utils/VerifyAdminToken.js";

const router = express.Router();

router.get("/users", VerifyAdminToken, getUsers);
router.get("/posts", VerifyAdminToken, getPosts);
router.post("/makeadminbyid/:userId", VerifyAdminToken, makeOrRemoveAdmin);
router.delete("/deleteuserbyid/:userId", VerifyAdminToken, deleteUser);
router.delete("/deletepostbyid/:postId", VerifyAdminToken, deletePost);

export default router;
