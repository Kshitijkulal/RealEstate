import express from "express"
import { login, logout, otpVerification, register } from "../controllers/auth.controlers.js"; //When importing named exports, you must use the same name as the export. Named exports are imported inside curly braces 
// but you can rename them using as syntax
// eg import { login as ln, logout as lt, register as rg }

const router = express.Router();

router.route(`/register`).post(register);

router.route(`/send-otp`).post(otpVerification);

router.route(`/login`).post(login);

router.route(`/logout`).post(logout);

export default router;