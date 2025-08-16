import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (typeof window === "undefined") return null;

  if (!socket) {
    const url = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    socket = io(url, {
      path: "/socket.io",
      withCredentials: true,
      transports: ["websocket"],
    });
  }
  return socket;
}
