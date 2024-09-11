const express = require('express');
const cors = require('cors');
const connectDb = require('./config');
const multer = require('multer');
require('dotenv').config();
const app = express();
const cloudinary = require('cloudinary');
app.use(cors());
app.use(express.json());
var Namec = 'dkfakg7mw'; 
var key = '472725881526577';   
var sec = 'j5oQTkwakGjAq8jLCcDGiO2s7jM';  
cloudinary.config({ 
    cloud_name: Namec,  
    api_key: key,      
    api_secret:sec
}); 
     
app.use(express.urlencoded({ extended: true }));
connectDb().then(() => {  
//     app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));                     
}).catch(error => { 
    console.error("Failed to connect to MongoDB:", error);
});     


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
            console.log(`Message sent from ${recipientId} to ${recipientId}`);
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

 
app.use('/api/saveName',require('./routes/User.route'));

app.get('/api/connected-users', (req, res) => {
    const connectedUsers = Array.from(socketConnected.keys()); // Get all userIds
    res.json({ connectedUsers });
}); 