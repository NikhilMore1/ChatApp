const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => {
    res.status(200).send("Hello server");
});

const server = app.listen(5000, () => {
    console.log(`Server has started on port ${process.env.PORT || 5000}`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:5173', // Replace with your frontend URL
        methods: ['GET', 'POST']
    }
});

let socketConnected = new Map();


io.on('connection', onConnection);

function onConnection(socket) {
    console.log("New user ", socket.id);
    socketConnected.set(socket.id);
    socket.on('register', (userId) => {
        socketConnected.set(userId, socket.id); // Map userId to socket.id
        console.log(`User ${userId} is connected with socket ID: ${socket.id}`);
      });
    io.emit('client-total', socketConnected.size);
    console.log("No any user" + socketConnected.size);

    // Listen for private messages
    socket.on('private_message', ({ recipientId, message }) => {
        const recipientSocketId = socketConnected.get(recipientId); // Find recipient's socket ID
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receive_message', {
                message,
                senderId: socket.id,
            });
            console.log(`Message sent from ${socket.id} to ${recipientId}`);
        } else {
            console.log('Recipient not found or not connected');
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        for (let [userId, socketId] of socketConnected.entries()) {
            if (socketId === socket.id) {
                socketConnected.delete(userId); // Remove user on disconnect
                console.log(`User ${userId} disconnected`);
                break;
            }
        }
        io.emit('client-total', socketConnected.size);
    });

    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
    console.log(socketConnected);
}
