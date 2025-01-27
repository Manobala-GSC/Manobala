// Message.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import "./Message.css";

const Message = ({ sender, text }) => {
  return (
    <div className={`message ${sender}`}>
      <div className="message-content">
        <ReactMarkdown 
          children={text}
          components={{
            p: ({ children }) => <p className="markdown-p">{children}</p>,
            h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
            h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
            h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
            ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
            ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
            li: ({ children }) => <li className="markdown-li">{children}</li>,
            code: ({ children }) => <code className="markdown-code">{children}</code>,
            pre: ({ children }) => <pre className="markdown-pre">{children}</pre>,
          }}
        />
      </div>
    </div>
  );
};

export default Message;