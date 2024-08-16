import express from "express";
import { isAdmin, isLoggedIn } from "../controllers/test.controler.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.route("/isloggedin").get(verifyToken,isLoggedIn);
router.route("/isadmin").get(isAdmin);

export default router;