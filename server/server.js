const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectToDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Store socketio in Express app settings to access in controllers
app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a complaint chat room
  socket.on('join_room', (complaintId) => {
    socket.join(complaintId);
    console.log(`User ${socket.id} joined complaint room: ${complaintId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));

// Root endpoint check
app.get('/', (req, res) => {
  res.json({ message: 'Online Complaint Registration API is running...' });
});

// Fallback Route for Undefined API Paths
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (online)`);
});
