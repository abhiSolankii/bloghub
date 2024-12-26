import express from "express";
import {
  updateUser,
  deleteUser,
  getUsers,
} from "../controllers/user.controller.js";
import VerifyToken from "../utils/VerifyToken.js";
import VerifyAdminToken from "../utils/VerifyAdminToken.js";

const router = express.Router();

router.put("/update/:userId", VerifyToken, updateUser);
router.delete("/delete/:userId", VerifyToken, deleteUser);
router.get("/getusers", VerifyAdminToken, getUsers);

export default router;
