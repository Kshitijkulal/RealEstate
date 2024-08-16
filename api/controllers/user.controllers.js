import prisma from "../lib/prisma.js";
import { encrypt } from "../utilities/substitutionCypher.js";
import jwt from "jsonwebtoken"

export const getUsers = async (req,res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    }catch (err) {
        console.log(err);
        res.status(500).json({message:`failed to get users!`});
    }
}
export const getUser = async (req,res) => {
    try {
        const u_id = req.params.id;
        const user = await prisma.user.findUnique({
            where:{
                id:u_id,
            }
        });
        res.status(200).json(user);
    }catch (err) {
        console.log(err);
        res.status(500).json({message:`failed to get user!`});
    }
}
export const updateUser = async (req,res) => {
    try {
        const u_id = req.params.id;
        const t_id = req.userId;
        const {password,avatar, ...vals} = req.body;
        if(t_id !== u_id){
            res.status(403).json({message:"Not Authorized!"})       
        }
        let updatedPassword = null;
        if (password){
            updatedPassword = await encrypt(password,process.env.HASH_KEY);
        }
        const updatedUser = await prisma.user.update({
            where:{
                id:u_id
            },
            data:{
                ...vals,
                ...(updatedPassword &&{password:updatedPassword}),
                ...(avatar && {avatar})
            }
        })
        const {password: uPassword, ...remaining} = updatedUser;
        res.status(200).json(remaining);
    }catch (err) {
        console.log(err);
        res.status(500).json({message:`failed to update user!`});
    }
}
export const deleteUser = async (req,res) => {
    try {
        const u_id = req.params.id;
        const t_id = req.userId;
        if(u_id != t_id) return res.status(403).json({message:`not Authorized !`});
        prisma.user.delete({
            where:{
                id:u_id
            }
        });
        res.status(200).json({message:`user deleted !`});
    }catch (err) {
        console.log(err);
        res.status(500).json({message:`failed to delete user!`});
    }
};

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;
  
    try {
      const savedPost = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId: tokenUserId,
            postId,
          },
        },
      });
  
      if (savedPost) {
        await prisma.savedPost.delete({
          where: {
            id: savedPost.id,
          },
        });
        res.status(200).json({ message: "Post removed from saved list" });
      } else {
        await prisma.savedPost.create({
          data: {
            userId: tokenUserId,
            postId,
          },
        });
        res.status(200).json({ message: "Post saved" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to delete users!" });
    }
  };

  export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId;
    try {

        if (!tokenUserId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userPosts = await prisma.post.findMany({
            where: { userID: tokenUserId },
        });

        const saved = await prisma.savedPost.findMany({
            where: { userId: tokenUserId },
            include: {
                post: true,
            },
        });

        const savedPosts = saved.map((item) => item.post);
        res.status(200).json({ userPosts, savedPosts });

    } catch (err) {
        console.error("Error fetching profile posts:", err);
        res.status(500).json({ message: "Failed to get profile posts!" });
    }
};

export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;
    try {
        const chats = await prisma.chat.count({
            where:{
                userIDs:{
                    hasSome: [tokenUserId],
                },
                NOT:{
                    seenBy:{
                        hasSome:[tokenUserId]
                    }
                }
            }
        });
        res.status(200).json(chats);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Failed to get profile notifications!" });
    }
};
