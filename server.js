const express = require('express');
const connectDB = require('./config/db');
const formData = require('express-form-data');
const morgan = require('morgan');
const { Server } = require("http");
const { Server: SocketServer } = require("socket.io");
const cors = require('cors');
require('colors');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes.js');
const newsRoutes = require('./routes/newsRoute.js');
const categoryRoutes = require('./routes/categoryRoute');
const associationRoutes = require('./routes/associationRoutes');
const memberRoutes = require('./routes/memberRoutes');
const circularRoutes = require('./routes/circularRoutes');
const updateRoutes = require('./routes/updateRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const packageRoutes = require('./routes/packageeRoutes');
const transportRoutes = require('./routes/transportRoutes');
const visaRoutes = require('./routes/visaRoutes');
const laxuryTransportRoutes = require('./routes/laxuryTransportRoutes');
const luxuryCruiseRoutes = require('./routes/luxuryCruiseRoutes');
const charterFlight = require('./routes/charterFlightRoutes');
const laxuryHotelRoutes = require('./routes/laxuryHotelRoutes');
const skillDevelopmentRoutes = require('./routes/skillDevelopmentRoutes');
const destinationProgramRoutes = require('./routes/destinationProgramRoutes');
const advisoryBoardRoutes = require('./routes/advisoryBoardRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const chaptersRoutes = require('./routes/chaptersRoutes');
const boardsRoutes = require('./routes/boardsRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const luxuryRoutes = require('./routes/luxuryRoutes');
const dmcRoutes = require('./routes/dmcRoutes');
const ufftaRoutes = require('./routes/ufftaRoutes');
const hotelBuyerRoutes = require('./routes/hotelBuyerRoutes');
const transportBuyerRoutes = require('./routes/transportBuyerRoutes');
const packageBuyerRoutes = require('./routes/packageBuyerRoutes');
const adRoutes = require('./routes/AdRoutes');
const insurenceRoutes = require('./routes/insurenceRoutes');
const hotnewsRoutes = require('./routes/hotnewsRoutes');
const LuxuryCarBookingRoutes = require('./routes/LuxuryCarBookingRoutes');
const ChatRoute = require('./routes/ChatRoute');
const MessageRoute = require('./routes/MessageRoute');
const countryRoutes = require('./routes/CountryRoutes');

connectDB();

const app = express();

// Express middleware setup
app.use(express.json({ limit: '100mb' }));
app.use(formData.parse());
app.use(cors());
app.use(morgan('dev')); // Logging middleware

// Define your routes
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/associations', associationRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/circulars', circularRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/hotel', hotelRoutes);
app.use('/api/package', packageRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/visa', visaRoutes);
app.use('/api/laxuryTransport', laxuryTransportRoutes);
app.use('/api/luxuryCruise', luxuryCruiseRoutes);
app.use('/api/charterFlight', charterFlight);
app.use('/api/LaxuryHotel', laxuryHotelRoutes);
app.use('/api/skillDevelopment', skillDevelopmentRoutes);
app.use('/api/destinationProgram', destinationProgramRoutes);
app.use('/api/advisoryBoard', advisoryBoardRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/chapters', chaptersRoutes);
app.use('/api/boards', boardsRoutes);
app.use('/api/abouts', aboutRoutes);
app.use('/api/luxury', luxuryRoutes);
app.use('/api/', dmcRoutes);
app.use('/api/HotelBuyer', hotelBuyerRoutes);
app.use('/api/TransportBuyer', transportBuyerRoutes);
app.use('/api/PackageBuyer', packageBuyerRoutes);
app.use('/api/uffta', ufftaRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/insurence', insurenceRoutes);
app.use('/api/hotnews', hotnewsRoutes);
app.use('/api/country', countryRoutes);
app.use('/api/LuxuryCarBooking',LuxuryCarBookingRoutes);
app.use('/api/chat', ChatRoute);
app.use('/api/message', MessageRoute);

// 404 Route
app.get('*', function(req, res){
  res.status(404).json({
    msg: "Api path not found."
  });
});

const PORT = process.env.PORT || 3000;

// Create HTTP server instance from Express app
const server = Server(app);

// Create Socket.IO instance and attach it to the HTTP server
const io = new SocketServer(server, {
  cors: {
    origin: "*", // Allow requests from all origins
  },
});

let activeUsers = [];

// Socket.IO logic
io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});

// Start listening on the specified port
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
