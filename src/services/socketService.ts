// // services/socketService.ts
// import { io, Socket } from "socket.io-client";

// let socket: Socket;

// export const connectSocket = (userId: string) => {
//   socket = io("http://localhost:5000");
//   socket.on("connect", () => {
//     socket.emit("register", { userId });
//   });
// };

// export const sendMessage = (from: string, to: string, message: string) => {
//   socket.emit("send_message", { from, to, message });
// };

// export const onReceiveMessage = (cb: (msg: any) => void) => {
//   socket.on("receive_message", cb);
// };

// export const disconnectSocket = () => {
//   socket.disconnect();
// };
