import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUsers.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(onlineUsers)
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  socket.on("sendMessage", ({ recieverId, data }) => {
    const receiver = getUser(recieverId);
    console.log(receiver);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
      console.log(`Message sent to ${recieverId}`);
    } else {
      console.error(`User ${recieverId} not found`);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(`User with socket ID ${socket.id} disconnected`);
  });
});

io.listen(7000, () => {
  console.log("Socket server running on port 7000");
});
