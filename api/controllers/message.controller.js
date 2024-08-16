import prisma from "../lib/prisma.js";

export const addMessage = async (req,res) => {
    const u_id = req.userId;
    const c_id = req.params.id;
    const text = req.body.text;
    try {
        const chat = await prisma.chat.findUnique({
            where:{
                id:c_id,
                userIDs: {
                    hasSome: [u_id],
                }
            }
        });
        if(!chat) return res.status(404).json({message:`Chat not found`})
        
            const message = await prisma.message.create({
                data:{
                    text,
                    chatId:c_id,
                    userId:u_id,
                }
            });
        
        await prisma.chat.update({
            where: {
                id: c_id,
            },
            data:{
                seenBy: [u_id],
                lastMessage:text,
            }
        })

            res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`Failed to add message`});
    }
}