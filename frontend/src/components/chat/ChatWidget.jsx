import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import "./css/ChatWidget.css";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-widget">
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <button
        className={`chat-widget-btn ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <img src="/favicon.png" alt="Chat" className="favicon-icon" />
        )}
        {!isOpen && <span className="chat-badge"></span>}
      </button>
    </div>
  );
}

export default ChatWidget;
