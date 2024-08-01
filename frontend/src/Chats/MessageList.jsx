import React from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages }) => {
  return (
    <ul id="message-container" className="message-container">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </ul>
  );
};

export default MessageList;
