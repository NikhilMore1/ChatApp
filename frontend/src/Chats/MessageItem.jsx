import React from 'react';
const MessageItem = ({ message }) => {
  return (
    <li className={message.isOwnMessage ? 'message-item message-right' : 'message-item message-left'}>
      <p className="message-content">
        <span style={{ fontSize: '20px' }}>
          <b>{message.message}</b>
        </span>
      </p>
    </li>
  );
};

export default MessageItem;
