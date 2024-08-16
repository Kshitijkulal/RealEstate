import jwt from "jsonwebtoken";

export const isLoggedIn = async (req,res) => {
 try {
    res.status(200).json({message:`You are Authenticated`});
 }
 catch(err){
    console.log(err);
 }
} 

export const isAdmin = async (req,res) => {
    try{
        const token = req.cookies.token;

    if(!token) return res.status(401).json({
        message:`not found`
    });
    jwt.verify(token, process.env.JWT_KEY, async (error, payload) => {
        if(error) return res.status(403).json({message:`Invalid token`});
        if(!payload.admin){
            return res.status(403).json({message:`Not Admin !`});
        }
    })
    res.status(200).json({message:`You're Admin`});
    }
    catch(err){
        console.log(err);
    }
}