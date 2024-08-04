import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import Feedback from './Feedback';
import NameInput from './NameInput';
import MainPage from '../Entrys/MainPage';

const socket = io('https://chatapp-5nrl.onrender.com'); // Connect to your backend URL

const Chat = () => {
  const [name, setName] = useState('anonymous');
  const [messages, setMessages] = useState([]);
  const [clientsTotal, setClientsTotal] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    socket.on('client-total', (data) => {
      setClientsTotal(data);
    });

    socket.on('chat-message', (data) => {
      setMessages((prevMessages) => [...prevMessages, { ...data, isOwnMessage: false }]);
    });

    socket.on('feedback', (data) => {
      setFeedback(data.feedback);
    });

    return () => {
      socket.off('client-total');
      socket.off('chat-message');
      socket.off('feedback');
    };
  }, []);

  const sendMessage = (message) => {
    const data = { name, message, date: new Date() };
    socket.emit('message', data);
    setMessages((prevMessages) => [...prevMessages, { ...data, isOwnMessage: true }]);
    setFeedback('');
  };
  let typingTimeout;
  clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('feedback', { feedback: '' });
    }, 1000);
  const sendFeedback = (feedback) => {
    clearTimeout(typingTimeout);
    socket.emit('feedback', { feedback });
  };

  return (
    <div className="chat">
     <MainPage/>
      <MessageList messages={messages} />
      <Feedback feedback={feedback} />
      <MessageForm sendMessage={sendMessage} sendFeedback={sendFeedback} name={name} />
      <h3 className="clients-total">Total users: {clientsTotal}</h3>
    </div>
  );
};

export default Chat;
