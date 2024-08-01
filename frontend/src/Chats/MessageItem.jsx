import React from 'react';

const MessageItem = ({ message }) => {
  return (
    <li className={message.isOwnMessage ? 'message-right' : 'message-left'}>
      <p className="message">
        <span style={{ fontSize: '20px' }}><b>{message.message}</b></span>
      </p>
    </li>
  );
};

export default MessageItem;
