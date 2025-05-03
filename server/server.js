
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const passport = require('passport');
const configurePassport = require('./config/passport');
const errorHandler = require('./middleware/errorHandler');
const { configureCloudinary } = require('./config/cloudinary');

// Connect to Database
connectDB();

// Configure Cloudinary
configureCloudinary();

const app = express();

// Configure Passport
configurePassport(passport);

// Init Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:9002', // Allow frontend origin
  credentials: true
}));
app.use(express.json({ extended: false })); // Body parser for JSON
app.use(passport.initialize()); // Initialize Passport

// Define Routes
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
// Add message routes later: app.use('/api/messages', require('./routes/messageRoutes')); // Example for future message routes

// Error Handling Middleware (Should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:9002',
    methods: ["GET", "POST"]
  }
});

// Basic Socket.IO connection handler (expand later)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Add more event listeners for chat functionality here
  // e.g., socket.on('sendMessage', (messageData) => { ... });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = { io }; // Export io instance if needed elsewhere
