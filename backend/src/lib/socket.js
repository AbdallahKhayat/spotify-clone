import { Server, Socket } from "socket.io";
import { Message } from "../models/message.model.js";

// the server is httpServer from index
export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", //frontend url
      credentials: true,
    },
  });

  // keep track of online status

  // when user logs in they will get a socket id immediately
  const userSockets = new Map(); // {key => userId : value => socketId}
  const userActivities = new Map(); // {userId : activity} to keep track of user activity like user is listening to

  //the connected user is socket object
  io.on("connection", (socket) => {
    //listen to incoming events connected, disconnected,message,listening

    //when user logs in
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle"); //just logged in so activity idle

      // server sending to all connected sockets that this user (userId) just logged in
      io.emit("user_connected", userId);

      // user wants to know  all online users from userSockets.keys (usersId)
      socket.emit("users_online", Array.from(userSockets.keys()));

      // server broadcasts  all online users activities
      io.emit("activites", Array.from(userActivities.keys()));
    });

    // when playing music or pausing u will call this
    socket.on("update_activity", ({ userId, activity }) => {
      console.log("activity updated", userId, activity);
      userActivities.set(userId, activity);

      //broadcast that this user activity has changed
      io.emit("activity_updated", { userId, activity });
    });

    //when user sends a message , also send them to database
    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        //send to receiver in realtime, if they're online
        const receiverSocketId = userSockets.get(receiverId);

        //this means that receiver is online
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        //successful message that u have sent the message
        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Message error", error);
        socket.emit("message_error", error.message);
      }
    });

    //when user disconnects
    socket.on("disconnect", () => {
      let disconnectedUserId;

      for (const [userId, socketId] of userSockets.entries()) {
        // find disconnected user
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          // delete user and user activities
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }

      // if disconnected user Id is true then let everyone know that this user disconnected
      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });
};

export default initializeSocket;
