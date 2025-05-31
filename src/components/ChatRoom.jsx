import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const API_URL    = "http://localhost:3000";   // ← backend
const SOCKET_URL = API_URL;                   // same origin as server

export default function ChatRoom({ user }) {
  const { applicationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState("");

  /* one socket for the entire tab ---------------------------------------- */
  const socketRef = useRef();
  if (!socketRef.current) {
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });
  }
  const socket = socketRef.current;

  /* join / leave the room ------------------------------------------------- */
  useEffect(() => {
    socket.emit("joinRoom", applicationId);

    const receive = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("receiveMessage", receive);

    return () => {
      socket.off("receiveMessage", receive);
      socket.emit("leaveRoom", applicationId);     // optional
    };
  }, [socket, applicationId]);

  /* get history ----------------------------------------------------------- */
  useEffect(() => {
    const token = user?.token || localStorage.getItem("token");
    axios
      .get(`${API_URL}/api/messages/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setMessages(r.data))
      .catch((e) => console.error("Fetch messages:", e));
  }, [applicationId, user?.token]);

  /* send ------------------------------------------------------------------ */
  const sendMessage = async () => {
    if (!text.trim()) return;

    const payload = {
      sender:      user._id,
      application: applicationId,
      text,
    };

    setText("");                     // clear box immediately
    socket.emit("sendMessage", payload); // let others see it instantly

    try {
      await axios.post(`${API_URL}/api/messages`, payload, {
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`,
        },
      });
      // no need to push into state; the server’s echo will do it
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  /* autoscroll on new message ------------------------------------------- */
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------------------------------------------------------------- */
  return (
    <div className="chat max-w-2xl mx-auto p-4">
      <div className="messages space-y-2 mb-4 h-96 overflow-y-auto border p-2 rounded">
        {messages.map((m) => (
          <p key={m._id}>
            <strong>{m.sender._id === user._id ? "You" : m.sender.name}:</strong>{" "}
            {m.text}
          </p>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Type your message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!text.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
