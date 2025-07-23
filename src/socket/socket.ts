// // // socket.ts
// // import { io } from "socket.io-client";
// // export const socket = io("http://localhost:5000"); // Update with backend URL

// // src/services/socket.ts
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   transports: ["websocket"],
//   autoConnect: false
// });

// export default socket;


import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false, // important
  transports: ["websocket"]
});

export default socket;
