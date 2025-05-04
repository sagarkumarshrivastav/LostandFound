
// Environment variables are now loaded via `node -r dotenv/config` in package.json scripts


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

// Init Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:9002', // Allow frontend origin
  credentials: true
}));
app.use(express.json({ extended: false })); // Body parser for JSON

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

server.listen(PORT, () => {
  // Check if critical environment variables are loaded (optional but good practice)
  if (!process.env.JWT_SECRET) {
      console.error('CRITICAL ERROR: JWT_SECRET is not defined. Check your .env file and server start command.');
      // Optionally exit if JWT_SECRET is missing, as it's crucial for auth
      // process.exit(1);
  }
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.warn("Warning: Missing Google Client ID or Secret. Google OAuth login will not work.");
  }
   if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn("Warning: Missing Cloudinary credentials. Image uploads will not work.");
   }
    if (!process.env.MONGODB_URI) {
        console.error('CRITICAL ERROR: MONGODB_URI is not defined. Cannot connect to database.');
        // process.exit(1);
    }


  // Configure Passport - ensure this happens after env vars are loaded
  configurePassport(passport);


  // Define Routes
  app.get('/', (req, res) => res.send('API Running'));
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/items', require('./routes/itemRoutes'));
  app.use('/api/messages', require('./routes/messageRoutes')); // Example for future message routes

  // Error Handling Middleware (Should be last)
  app.use(errorHandler);


  console.log(`Server started on port ${PORT}`);
});

module.exports = { io }; // Export io instance if needed elsewhere
