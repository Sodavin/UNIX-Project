import React, { useState } from "react";
import "./css/ChatInput.css";

function ChatInput({ onSendMessage, isLoading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <textarea
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask about products, sizes, discounts..."
        className="chat-input"
        disabled={isLoading}
        rows="1"
      />
      <button
        type="submit"
        className={`chat-send-btn ${isLoading ? "loading" : ""}`}
        disabled={!input.trim() || isLoading}
        aria-label="Send message"
      >
        {isLoading ? (
          <span className="spinner"></span>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
          </svg>
        )}
      </button>
    </form>
  );
}

export default ChatInput;
