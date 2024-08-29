// import React, { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import MessageForm from './MessageForm';
// import MessageList from './MessageList';
// import Feedback from './Feedback';
// import './MessageForm.css';
// import './ChatPage.css';

// const socket = io('http://localhost:5000/'); // Connect to your backend URL

// const Chat = () => {
//   const Names = localStorage.getItem("name");
//   const [name, setName] = useState(Names);
//   const [messages, setMessages] = useState([]);
//   const [clientsTotal, setClientsTotal] = useState(0);
//   const [feedback, setFeedback] = useState('');
//   const [recipientId, setRecipientId] = useState(''); // Add recipient ID state

//   useEffect(() => {
//     socket.emit('register', name); // Register user with the server

//     socket.on('client-total', (data) => {
//       setClientsTotal(data);
//     });

//     socket.on('receive_message', (data) => {
//       setMessages((prevMessages) => [...prevMessages, { ...data, isOwnMessage: false }]);
//     });

//     socket.on('feedback', (data) => {
//       setFeedback(data.feedback);
//     });

//     return () => {
//       socket.off('client-total');
//       socket.off('receive_message');
//       socket.off('feedback');
//     };
//   }, [name]);

//   const sendMessage = (message) => {
//     const data = { recipientId, message }; // Send message to the specific recipient
//     socket.emit('private_message', data);
//     setMessages((prevMessages) => [...prevMessages, { message, senderId: 'You', isOwnMessage: true }]);
//     setFeedback('');
//   };

//   const sendFeedback = (feedback) => {
//     socket.emit('feedback', { feedback });
//   };

//   return (
//     <div className="bodys1">
//       <div className="chat">
//         <div className="row">
//           <div className="col" style={{ textAlign: 'center' }}>
//             <h3 className="clients-total">Total users: {clientsTotal}</h3>
//           </div>
//         </div>

//         <div>
//           <label>Recipient ID: </label>
//           <input
//             type="text"
//             placeholder="Enter recipient's ID"
//             value={recipientId}
//             onChange={(e) => setRecipientId(e.target.value)}
//           />
//         </div>

//         <MessageList messages={messages} />
//         <Feedback feedback={feedback} />
//         <MessageForm sendMessage={sendMessage} sendFeedback={sendFeedback} name={name} />
//       </div>
//     </div>
//   );
// };

// export default Chat;





import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import Feedback from './Feedback';
import './MessageForm.css';
import './ChatPage.css';
import { useParams } from 'react-router-dom'; // Import useParams
import FilesHandle from './FilesHandle';

const socket = io('http://localhost:5000/'); // Connect to your backend URL

const Chat = () => {
  const { recipientId } = useParams(); // Get recipientId from URL parameters
  const Names = localStorage.getItem("name");
  const [name, setName] = useState(Names[recipientId]);
  const [messages, setMessages] = useState([]);
  const [clientsTotal, setClientsTotal] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [recipientName, setRecipientName] = useState(''); // State to store recipient's name

  useEffect(() => {
    socket.emit('register', Names); // Register user with the server

    socket.on('client-total', (data) => {
      setClientsTotal(data);
    });

    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, { ...data, isOwnMessage: false }]);
    });

    socket.on('feedback', (data) => {
      setFeedback(data.feedback);
    });

    // Fetch recipient's name based on recipientId
    const fetchRecipientName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getUserName/${recipientId}`);
        const data = await response.json();
        setRecipientName(data.name);
      } catch (error) {
        console.error('Error fetching recipient name:', error);
      }
    };

    fetchRecipientName();

    return () => {
      socket.off('client-total');
      socket.off('receive_message');
      socket.off('feedback');
    };
  }, [name, recipientId]);

  // const sendMessage = (message) => {
  //   if (!recipientId) {
  //     console.error('No recipient ID provided');
  //     return;
  //   }
  //   const data = { recipientId, message }; // Send message to the specific recipient
  //   socket.emit('private_message', data);
  //   setMessages((prevMessages) => [...prevMessages, { message, senderId: 'You', isOwnMessage: true }]);
  //   // console.log("message",message);
    
  //   setFeedback('');
  // };


  const sendMessage = (message) => {
    if (!recipientId) {
      console.error('No recipient ID provided');
      return;
    }
  
    if (typeof message === 'string') {
      // Handle text message
      const data = { recipientId, message };
      socket.emit('private_message', data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { message, senderId: 'You', isOwnMessage: true }
      ]);
    } else if (message instanceof File) {
      // Handle file upload
      const formData = new FormData();
      formData.append('file', message);
      formData.append('recipientId', recipientId);
  
      // Example: Upload file to server using fetch or axios
      fetch('/upload', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          // Handle successful file upload
          const fileMessage = {
            message: data.fileUrl, // Assuming the server returns the file URL
            senderId: 'You',
            isOwnMessage: true,
            isFile: true
          };
          setMessages((prevMessages) => [...prevMessages, fileMessage]);
          socket.emit('private_message', fileMessage);
        })
        .catch(error => {
          console.error('File upload failed:', error);
        });
    } else {
      console.error('Unsupported message type');
    }
  
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
            <h4>Chatting with: {recipientId}</h4> {/* Display recipient's name */}
          </div>
        </div>

        <div>
          <label>Recipient ID: </label>
          <input
            type="text"
            placeholder="Enter recipient's ID"
            value={recipientId}
            readOnly // Make input read-only if recipientId is provided via URL
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




