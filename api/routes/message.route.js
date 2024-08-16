import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { addMessage } from "../controllers/message.controller.js";


const router = express.Router();

router.route(`/:id`).post(verifyToken,addMessage);

export default router;