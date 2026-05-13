import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const joinRoom = () => {
    if (!roomId || !username.trim()) return;
    
    const ws = new WebSocket("ws://localhost:8080");
    
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: Number(roomId),
          },
        })
      );
      setJoined(true);
    };

    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  };

  const sendMessage = () => {
    if (!input || !wsRef.current) return;
    
    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: `${username}: ${input}`,
        },
      })
    );
    setInput("");
  };

  return (
    <div className="h-screen w-full flex flex-col bg-black text-white transition-colors duration-500 overflow-hidden font-sans">
      {!joined ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md p-8 space-y-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl mx-4">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter text-white">
                Nexus Chat
              </h1>
              <p className="text-zinc-400">
                Enter your name and a room ID to start chatting.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white outline-none transition-all text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Room ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white outline-none transition-all text-white"
                />
              </div>
              
              <button
                onClick={joinRoom}
                className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="px-6 py-4 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <h2 className="text-xl font-bold text-white">
                Room: {roomId}
              </h2>
            </div>
            <button 
              onClick={() => {
                wsRef.current?.close();
                setJoined(false);
                setMessages([]);
              }}
              className="px-4 py-2 text-sm font-medium border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors text-white"
            >
              Leave
            </button>
          </header>

          {/* Messages */}
          <main className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-zinc-600 italic">No messages yet...</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const colonIdx = msg.indexOf(": ");
                const senderName = colonIdx !== -1 ? msg.slice(0, colonIdx) : "Unknown";
                const content = colonIdx !== -1 ? msg.slice(colonIdx + 2) : msg;
                const isMe = senderName === username;

                return (
                  <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <span className="text-xs font-semibold mb-1 px-2 text-zinc-400">
                      {isMe ? "You" : senderName}
                    </span>
                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] border ${
                      isMe
                        ? "bg-white text-black border-zinc-200"
                        : "bg-zinc-900 text-zinc-200 border-zinc-800"
                    }`}>
                      <p>{content}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </main>

          {/* Input */}
          <footer className="p-6 border-t border-zinc-900 bg-black/50 backdrop-blur-xl">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-white outline-none transition-all text-white"
              />
              <button
                onClick={sendMessage}
                className="px-8 py-3 bg-white text-black font-bold rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Send
              </button>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
