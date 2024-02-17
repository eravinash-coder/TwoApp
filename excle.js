const express = require('express');
const connectDB = require('./config/db');
const multer = require('multer'); // Import multer for file upload handling
const upload = multer({ dest: 'uploads/' }); // Set upload directory
const Member = require('./models/Member'); // Import the Member model
const excel = require('exceljs'); // Import the Excel library
const morgan = require('morgan');
const bcrypt = require('bcrypt');
require('colors');
require('dotenv').config();

connectDB();


// Establish a connection to MongoDB
const app = express();

app.use(express.json({ limit: '100mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.post('/upload-excel', upload.single('excelFile'), async (req, res) => {
  try {
    // Get the path of the uploaded file
    const filePath = req.file.path;

    // Read data from Excel file
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1); // Assuming data is on the first worksheet
    const data = [];

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);

      const email = row.getCell(3).value;
      const existingMember = await Member.findOne({ email });

      if (existingMember) {
        console.log(`Skipping data with email ${email} as it already exists`);
        continue; // Skip insertion if email already exists
      }

      const associationId = row.getCell(1).value;
      const name = row.getCell(2).value;
      const password = row.getCell(4).value;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new member instance
      const newMember = new Member({
        associationId,
        name,
        email,
        password: hashedPassword // Store the hashed password
      });

      await newMember.save();
      console.log(`Data inserted successfully for email: ${email}`);
    }

    res.send('Data import complete');
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).send('Error importing data');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.red,
  ),
);
