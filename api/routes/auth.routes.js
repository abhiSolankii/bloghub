import express from "express";
import {
  signIn,
  signOut,
  signUp,
  google,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/google", google);

export default router;
