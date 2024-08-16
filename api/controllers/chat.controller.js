import prisma from "../lib/prisma.js";

export const getChat = async (req,res) => {
const id = req.params.id;
const userId = req.userId;
try {

    const chat = await prisma.chat.findUnique({
        where:{
            id,
            userIDs:{
                hasSome: [userId],
            }
        },
        include: {
            messages:{
                orderBy:{
                    createdAt:"asc",
                }
            }
        }
    })

    await prisma.chat.update({
        where:{
            id,
        },
        data:{
            seenBy:{
                set:[userId],
            }
        }
    })
    res.status(200).json(chat);
} catch (error) {
    console.log(error);
    res.status(500).json({message:`couldn't get chat`});
}
}
export const getChats = async (req,res) => {
    try {
        const userId = req.userId;
        const chats = await prisma.chat.findMany({
            where:{
                userIDs:{
                    hasSome:[userId]
                }
            }
        });
         for(const chat of chats){
            const r_id =  chat.userIDs.find((id) => id != userId);

            const reciever = await prisma.user.findUnique({
                where:{
                    id: r_id,
                },
                select:{
                    id:true,
                    username:true,
                    avatar:true,
                }
            })
        chat.reciever = reciever; 
        }
        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`couldn't get chats`});
    }
}

    export const addChat = async (req,res) => {
        try {
            const userId = req.userId;
            const recieverId = req.body.recieverId;
            const newChat = await prisma.chat.create({
                data:{
                    userIDs:[userId,recieverId]
                }
            });
            res.status(200).json(newChat);
        } catch (error) {
            console.log(error);
            res.status(500).json({message:`couldn't add chat`});
        }
}

export const readChat = async (req,res) => {
    const id = req.params.id;
    const uId = req.userId;
    try {
        const chat = await prisma.chat.update({
            where:{
                id,
                userIDs:{
                    hasSome:[uId]
                }
            },
            data:{
                seenBy:{
                    push:[uId],
                },
            }
        })
        res.status(200).json({chat});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`couldn't get chat`});
    }
}