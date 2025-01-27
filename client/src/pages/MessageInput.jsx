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
    <div className="border-t border-gray-700 p-6">
      <div className="flex items-end space-x-2">
        <textarea
          className="flex-grow bg-gray-800 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
          rows="3"
          placeholder="Type your message..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSendClick}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
