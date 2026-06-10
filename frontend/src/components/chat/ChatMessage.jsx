import React from "react";
import { Link } from "react-router-dom";
import "./css/ChatMessage.css";

function renderMessageContent(message) {
  return message.split("\n").map((line, index) => {
    const parts = line.split(/(\/product-detail\/\d+)/g);
    return (
      <span key={index}>
        {parts.map((part, partIndex) => {
          if (part.startsWith("/product-detail/")) {
            return (
              <Link key={partIndex} to={part} className="chat-link">
                {part}
              </Link>
            );
          }
          return <React.Fragment key={partIndex}>{part}</React.Fragment>;
        })}
        {index < message.split("\n").length - 1 ? <br key={`${index}-br`} /> : null}
      </span>
    );
  });
}

function ChatMessage({ message, isBot }) {
  return (
    <div className={`chat-message ${isBot ? "bot" : "user"}`}>
      <div className="message-avatar">
        {isBot ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="7" width="20" height="10" rx="2" />
            <circle cx="7" cy="12" r="1" fill="white" />
            <circle cx="17" cy="12" r="1" fill="white" />
            <path d="M9 14c.5.5 1.5.5 3 .5s2.5 0 3-.5" stroke="white" fill="none" strokeWidth="0.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
          </svg>
        )}
      </div>
      <div className="message-content">
        <p className="message-text">{renderMessageContent(message)}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
