// Chatbot.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Message from "./Message";
import MessageInput from "./MessageInput";
import Sidebar from "../components/Sidebar";
import { AppContent } from '../context/AppContext';
import "./ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isLoggedin } = useContext(AppContent);

  useEffect(() => {
    if (isLoggedin) {
      fetchConversations();
    }
  }, [isLoggedin]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/conversations', {
        withCredentials: true
      });
      if (response.data.success) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/conversations', {
        title: 'New Chat'
      }, { withCredentials: true });

      if (response.data.success) {
        setConversations([response.data.conversation, ...conversations]);
        setActiveConversation(response.data.conversation._id);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await axios.delete(`http://localhost:8000/api/conversations/${conversationId}`, {
        withCredentials: true
      });
      setConversations(conversations.filter(conv => conv._id !== conversationId));
      if (activeConversation === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/conversations/${conversationId}/messages`, {
        withCredentials: true
      });
      if (response.data.success) {
        setMessages(response.data.messages);
        setActiveConversation(conversationId);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const updateConversationTitle = async (conversationId, firstMessage) => {
    try {
      // Generate a title based on the first message (max 50 characters)
      const title = firstMessage.length > 50 
        ? firstMessage.substring(0, 47) + '...'
        : firstMessage;

      const response = await axios.put(
        `http://localhost:8000/api/conversations/${conversationId}/title`,
        { title },
        { withCredentials: true }
      );

      if (response.data.success) {
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv._id === conversationId 
              ? { ...conv, title } 
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Error updating conversation title:", error);
    }
  };

  const sendMessage = async (text) => {
    if (!isLoggedin || !activeConversation) return;

    const isFirstMessage = messages.length === 0;
    const newMessage = { sender: "user", text, timestamp: new Date() };
    setMessages([...messages, newMessage]);
    setLoading(true);

    try {
      // Save user message
      await axios.post(`http://localhost:8000/api/conversations/${activeConversation}/messages`, {
        text,
        sender: 'user'
      }, { withCredentials: true });

      // Update conversation title if this is the first message
      if (isFirstMessage) {
        await updateConversationTitle(activeConversation, text);
      }

      // Get AI response
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
            "Content-Type": "application/json",
          },
          withCredentials: false // Explicitly set to false for the Gemini API call
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const botMessage = {
          sender: "bot",
          text: response.data.candidates[0].content.parts[0].text,
          timestamp: new Date()
        };
        
        // Save bot message
        await axios.post(`http://localhost:8000/api/conversations/${activeConversation}/messages`, {
          text: botMessage.text,
          sender: 'bot'
        }, { withCredentials: true });

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("API Error:", error);
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
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationClick={loadConversation}
        onNewChat={createNewChat}
        onDeleteConversation={deleteConversation}
      />
      <div className="chatbot-main">
        <div className="chatbot-header">
          <h1>{activeConversation ? 'Chat' : 'New Chat'}</h1>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <Message key={index} sender={msg.sender} text={msg.text} />
          ))}
          {loading && <div className="bot-typing">AI is thinking...</div>}
        </div>
        <MessageInput sendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatBot;