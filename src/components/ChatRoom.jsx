import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

// ✅ Update this to the correct backend port
const socket = io("http://localhost:3000");

const ChatRoom = ({ user }) => {
  const { applicationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", applicationId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [applicationId]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/messages/${applicationId}`) // ✅ Fixed URL
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Fetch messages error:", err));
  }, [applicationId]);

  const sendMessage = async () => {
    if (!user?._id || !text.trim()) return;

    const msg = {
      roomId: applicationId,
      sender: user._id,
      text,
    };

    setText("");
    socket.emit("sendMessage", msg);
    try {
      await axios.post("http://localhost:3000/api/messages", {
        ...msg,
        application: applicationId,
      });
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div className="chat max-w-2xl mx-auto p-4">
      <div className="messages space-y-2 mb-4">
        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.sender === user._id ? "You" : "Them"}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
