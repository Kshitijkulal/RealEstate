import express from "express";
import { deleteUser, getUser, getUsers, updateUser, savePost, profilePosts, getNotificationNumber} from "../controllers/user.controllers.js";
import {verifyToken} from "../middlewares/verifyToken.js";
const router = express.Router();

router.route(`/`).get(getUsers);
router.route(`/:id`).put(verifyToken, updateUser).delete(verifyToken, deleteUser);
router.route(`/save`).post(verifyToken,savePost)
router.route("/profileposts").get(verifyToken, profilePosts);
router.route("/notification").get(verifyToken,getNotificationNumber)
export default router;