import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  useEffect(() => {
    setSocket(io("http://localhost:7000"));
  }, []);

  useEffect(() => {
    currentUser && socket && socket.emit("newUser", currentUser.id);
    console.log(socket);
    }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
  );
};
