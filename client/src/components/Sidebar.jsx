import React from 'react';
import { format } from 'date-fns';
import './Sidebar.css';

const Sidebar = ({ 
  conversations, 
  activeConversation, 
  onConversationClick, 
  onNewChat,
  onDeleteConversation 
}) => {
  return (
    <div className="chatbot-sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>
        + New Chat
      </button>
      
      <div className="conversations-list">
        {conversations.map((conv) => (
          <div 
            key={conv.id}
            className={`conversation-item ${conv.id === activeConversation ? 'active' : ''}`}
            onClick={() => onConversationClick(conv.id)}
          >
            <div className="conversation-title">{conv.title}</div>
            <div className="conversation-meta">
              <span className="conversation-date">
                {format(new Date(conv.updatedAt), 'MMM d, yyyy')}
              </span>
              <button 
                className="delete-conversation-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 