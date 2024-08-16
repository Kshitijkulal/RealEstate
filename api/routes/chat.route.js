import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { addChat, getChat, getChats, readChat } from "../controllers/chat.controller.js";


const router = express.Router();

router.route(`/:id`).get(verifyToken,getChat);
router.route(`/`).get(verifyToken,getChats).post(verifyToken,addChat);
router.put(`/read/:id`).post(verifyToken,readChat);

export default router;