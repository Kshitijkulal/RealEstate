import express from "express";
import path from "path";
import body from "body-parser";
import authRoute from "./routes/auth.route.js"; // default exports can be named whatever you like while importing.
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({ path: './keys.env' });

export const app = express();

const port = 8080;

// console.log(process.env.CLIENT_URL);
app.use(cors({origin:process.env.CLIENT_URL, credentials:true}));
app.use(express.json());
app.use(cookieParser());

app.use(`/api/posts`,postRoute)
app.use(`/api/auth`,authRoute);
app.use(`/api/test`,testRoute);
app.use(`/api/users`,userRoute);
app.use(`/api/chats`,chatRoute);
app.use(`/api/messages`,messageRoute);


app.listen(port, ()=>{
    console.log(`Server is active on http://localhost:${port}`);
});