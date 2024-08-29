import React, { useState } from 'react';
import './MessageForm.css';
import { useParams } from 'react-router-dom';

const MessageForm = ({ sendMessage, sendFeedback }) => {
  const [message, setMessage] = useState('');
  const { recipientId } = useParams(); // Destructure the 'name' from useParams

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleTyping = () => {
    const gt = localStorage.getItem('gt');
    sendFeedback(`${recipientId} is typing...`); // Use the 'name' here
    console.log(sendFeedback);
  };

  return (
    <div className='row msg-f'>
      <div className='container-fluid msg-ff'>
        <div className='message-form-container'>
          <form className="message-form" onSubmit={handleSubmit}>
            <input
              type="text"
              style={{ width: '70rem', height: '50px' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleTyping}
              placeholder="Enter Message"
              className="message-input"
            />
            <button
              type="submit"
              className="send-button"
              style={{ height: '50px', width: '70px', fontSize: '30px' }}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageForm;
