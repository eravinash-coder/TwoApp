const express = require('express');
const connectDB = require('./config/db');
const formData = require('express-form-data');

require('colors');
require('dotenv').config();
var cors = require('cors')
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

const morgan = require('morgan');



connectDB();

const app = express();


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(cors());
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

app.get('*', function(req, res){
  res.status(404).json({
    msg: "Api path not found."
  });
});

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.red,
  ),
);