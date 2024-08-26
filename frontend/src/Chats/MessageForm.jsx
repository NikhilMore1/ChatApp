import React, { useState } from 'react';
// import './MessageForm.css';
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
    <div className='row msg-f'>
        <div className='container-fluid msg-ff'>
       <div className='message-form-container'>
       <form className="message-form " onSubmit={handleSubmit}>
      <input
        type="text"
        style={{width:'70rem',height:'50px'}}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleTyping}
        placeholder="Enter Message"
        className="message-input"
      />
      <button type="submit" className="send-button" style={{height:'50px',width:'70px',fontSize:'30px'}}>
       <i className="fas fa-paper-plane"></i>
      </button>
    </form>
       </div>
        </div>
    </div>
  );
};

export default MessageForm;
