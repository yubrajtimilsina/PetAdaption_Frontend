import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { Send, Users, MessageCircle } from "lucide-react";

const API_URL = "http://localhost:3000";
const SOCKET_URL = API_URL;

export default function ChatRoom({ user }) {
  const { applicationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef();
  if (!socketRef.current) {
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });
  }
  const socket = socketRef.current;

  useEffect(() => {
    socket.emit("joinRoom", applicationId);
    const receive = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("receiveMessage", receive);
    return () => {
      socket.off("receiveMessage", receive);
      socket.emit("leaveRoom", applicationId);
    };
  }, [socket, applicationId]);

  // Load previous messages
  useEffect(() => {
    const token = user?.token || localStorage.getItem("token");
    axios
      .get(`${API_URL}/api/messages/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Fetch messages:", err));
  }, [applicationId, user?.token]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const payload = {
      sender: user._id,
      application: applicationId,
      text: text.trim(),
    };
    setText("");
    setIsTyping(true);

    try {
      await axios.post(`${API_URL}/api/messages`, payload, {
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("Send message error:", err);
    }

    setTimeout(() => setIsTyping(false), 800);
  };

  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helpers
  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  const getAvatarColor = (userId) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    const index = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Chat Room</h1>
              <p className="text-sm text-gray-500">Application #{applicationId?.slice(-8)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Users className="w-5 h-5" />
            <span className="text-sm">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((m, index) => {
                const isOwn = m.sender?._id === user._id;
                const showAvatar = index === 0 || messages[index - 1]?.sender?._id !== m.sender?._id;

                return (
                  <div
                    key={m._id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-6' : 'mt-1'}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {showAvatar && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(m.sender?._id)}`}>
                          {getInitials(m.sender?.name || "U")}
                        </div>
                      )}

                      <div className={`relative px-4 py-2 rounded-2xl ${showAvatar ? '' : isOwn ? 'mr-10' : 'ml-10'}`}>
                        <div className={`${isOwn ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 shadow-sm border'} px-4 py-2 rounded-2xl`}>
                          {!isOwn && showAvatar && (
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              {m.sender?.name || "Unknown"}
                            </p>
                          )}
                          <p className="text-sm leading-relaxed">{m.text}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                            {formatTime(m.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">Sending...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-white px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                  placeholder="Type your message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
