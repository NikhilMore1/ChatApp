import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import Feedback from './Feedback';
import './MessageForm.css';
import './ChatPage.css';

const socket = io('http://localhost:5000/'); // Connect to your backend URL

const Chat = () => {
  const Names = localStorage.getItem("name");
  const [name, setName] = useState(Names);
  const [messages, setMessages] = useState([]);
  const [clientsTotal, setClientsTotal] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [recipientId, setRecipientId] = useState(''); // Add recipient ID state

  useEffect(() => {
    socket.emit('register', name); // Register user with the server

    socket.on('client-total', (data) => {
      setClientsTotal(data);
    });

    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, { ...data, isOwnMessage: false }]);
    });

    socket.on('feedback', (data) => {
      setFeedback(data.feedback);
    });

    return () => {
      socket.off('client-total');
      socket.off('receive_message');
      socket.off('feedback');
    };
  }, [name]);

  const sendMessage = (message) => {
    const data = { recipientId, message }; // Send message to the specific recipient
    socket.emit('private_message', data);
    setMessages((prevMessages) => [...prevMessages, { message, senderId: 'You', isOwnMessage: true }]);
    setFeedback('');
  };

  const sendFeedback = (feedback) => {
    socket.emit('feedback', { feedback });
  };

  return (
    <div className="bodys1">
      <div className="chat">
        <div className="row">
          <div className="col" style={{ textAlign: 'center' }}>
            <h3 className="clients-total">Total users: {clientsTotal}</h3>
          </div>
        </div>

        <div>
          <label>Recipient ID: </label>
          <input
            type="text"
            placeholder="Enter recipient's ID"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          />
        </div>

        <MessageList messages={messages} />
        <Feedback feedback={feedback} />
        <MessageForm sendMessage={sendMessage} sendFeedback={sendFeedback} name={name} />
      </div>
    </div>
  );
};

export default Chat;
