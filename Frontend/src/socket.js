import { io } from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_API_URL;
const socket = io(ENDPOINT, {
    transports: ["websocket"],
});

export default socket;
