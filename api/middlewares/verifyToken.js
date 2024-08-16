import jwt from "jsonwebtoken";

export const 
verifyToken = (req,res,next) => {
    const token = req.cookies.token;

    if(!token) return res.status(401).json({
        message:`not found`
    });
    jwt.verify(token, process.env.JWT_KEY, async (error, payload) => {
        if(error) return res.status(403).json({message:`Invalid token`});
        req.userId = payload.id;
        next();
    });
}