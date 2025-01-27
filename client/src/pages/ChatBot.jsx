// Chatbot.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { AppContent } from '../context/AppContext.jsx';
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedin } = useContext(AppContent);

  useEffect(() => {
    if (isLoggedin) {
      fetchChatHistory();
    }
  }, [isLoggedin]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/chat/history', {
        withCredentials: true
      });
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendMessage = async (text) => {
    if (!isLoggedin) {
      return;
    }

    const newMessage = { sender: "user", text, timestamp: new Date() };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Save user message
      await axios.post('http://localhost:8000/api/chat/message', {
        text,
        sender: 'user'
      }, { withCredentials: true });

      // Get AI response - Modified API call
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: text
            }]
          }]
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: false // Remove credentials for Gemini API call
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const botMessage = {
          sender: "bot",
          text: response.data.candidates[0].content.parts[0].text,
          timestamp: new Date()
        };
        
        // Save bot message
        await axios.post('http://localhost:8000/api/chat/message', {
          text: botMessage.text,
          sender: 'bot'
        }, { withCredentials: true });

        setMessages([...newMessages, botMessage]);
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessages([
        ...newMessages,
        { 
          sender: "bot", 
          text: "Sorry, something went wrong. Please try again!" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedin) {
    return (
      <div className="chatbot-container">
        <div className="chatbot-header">Please login to use the chatbot</div>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Ask for Help</div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
        {loading && <div className="bot-typing">AI is thinking...</div>}
      </div>
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default Chatbot;