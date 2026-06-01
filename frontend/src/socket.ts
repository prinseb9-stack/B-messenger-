import { getToken } from "./api";

let socket: WebSocket | null = null;
let messageHandler: ((msg: any) => void) | null = null;

export function connectSocket() {
  const token = getToken();
  if (!token) return;

  socket = new WebSocket(`ws://${window.location.host}/ws?token=${token}`);

  socket.onopen = () => {
    console.log("WebSocket connected!");
  };

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (messageHandler) messageHandler(msg);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
    setTimeout(connectSocket, 3000);
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };
}

export function sendMessage(toUserID: string, conversationID: string, content: string) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("WebSocket not connected");
    return;
  }

  socket.send(JSON.stringify({
    to_user_id: toUserID,
    conversation_id: conversationID,
    content,
    type: "text",
  }));
}

export function onMessage(handler: (msg: any) => void) {
  messageHandler = handler;
}

export function disconnectSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}
