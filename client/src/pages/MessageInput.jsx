// MessageInput.jsx
import React, { useState } from "react";
import "./MessageInput.css";

const MessageInput = ({ sendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      sendMessage(inputValue.trim()); // Call the sendMessage function
      setInputValue(""); // Clear input field
    }
  };

  const handleSendClick = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="message-input-container">
      <input
        className="message-input"
        type="text"
        placeholder="Type your message..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Detect "Enter" key press
      />
      <button className="send-button" onClick={handleSendClick}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
