import React, { useState } from 'react';

const MessageForm = ({ sendMessage, sendFeedback, name }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleTyping = () => {
    sendFeedback(`${name} is typing...`);
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleTyping}
        placeholder="Enter Message"
        className="message-input"
      />
      <button type="submit" className="send-button">
        Send <i className="fas fa-paper-plane"></i>
      </button>
    </form>
  );
};

export default MessageForm;
