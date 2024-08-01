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
        origin: 'https://chat-app-gules-two.vercel.app', // Replace with your frontend URL
        methods: ['GET', 'POST']
    }
});

let socketConnected = new Set();

io.on('connection', onConnection);

function onConnection(socket) {
    console.log("New user ", socket.id);
    socketConnected.add(socket.id);
    io.emit('client-total', socketConnected.size);
    console.log("No any user" + socketConnected.size);

    socket.on("disconnect", () => {
        console.log("User left", socket.id);
        socketConnected.delete(socket.id);
        io.emit('client-total', socketConnected.size);
    });

    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
}
