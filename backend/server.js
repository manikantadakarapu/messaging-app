// === ✅ UPDATED server.js ===

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Get Messages API
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load messages' });
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Socket.IO Handling
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('sendMessage', async (data) => {
    try {
      const message = new Message({
        sender: data.sender,
        content: data.text,
        timestamp: new Date(),
      });
      await message.save();

      io.emit('receiveMessage', {
        sender: data.sender,
        text: data.text,
        time: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.error('❌ Error saving message:', err);
    }
  });

  socket.on('typing', (username) => {
  socket.broadcast.emit('userTyping', username);
});

socket.on('stopTyping', (username) => {
  socket.broadcast.emit('userStopTyping', username);
});


  socket.on('disconnect', () => {
    console.log(`❎ Client disconnected: ${socket.id}`);
  });
});

// Server Listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
