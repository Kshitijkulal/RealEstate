import express from "express"
import {verifyToken} from "../middlewares/verifyToken.js";
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.route("/").get(getPosts).post(verifyToken,addPost);
router.route("/:id").get(getPost).put(verifyToken,updatePost).delete(verifyToken,deletePost);
export default router; // default exports can be named whatever you like.
// default allows you to export only a single value or entity from a module.